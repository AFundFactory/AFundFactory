import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { TaquitoService } from '../../services/taquito.service'
import { TzktService } from '../../services/tzkt.service';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Campaign } from 'src/app/models/campaign.model';

export function validUrl(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null
    try {
      let str = control.value;
      if (str.indexOf('://') === -1) {
        str = `https://${str}`;
      }
      new URL(str);
      return null;
    } catch (_) {
      return { invalidUrl: true };
    }
  };
}


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern('[\x20-\x7e]*'), Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.pattern('[\x20-\x7e\n]*'), Validators.maxLength(1000)]),
    url: new FormControl('', validUrl()),
    goal: new FormControl<number|null>(null, Validators.required),
    ascii_array: new FormControl<string[]>([], Validators.required),
    category: new FormControl('', Validators.required),
    owner: new FormGroup({
      address: new FormControl(''),
      alias: new FormControl('')
    }),
    donated: new FormControl(0),
    creationDate: new FormControl(new Date(Date.now()).toString()),
    ascii: new FormControl(''),
    closed: new FormControl(false),
    contract: new FormControl(''),
    version: new FormControl('')
  });

  formValue: Campaign = new Campaign()
  availableCategories: string[] = [];
  ownAddress: string | undefined = undefined

  // DRAG AND DRP
  errorFiles!: string;
  dragAreaClass!: string;
  
  // ASCII
  @ViewChild('myCanvas', { static: false })
  myCanvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  img!: string | ArrayBuffer | null | undefined;
  asciiText!: string;

  constructor(
    private taquito: TaquitoService,
    public router: Router,
    public dialog: MatDialog,
    private tzkt: TzktService
  ) {
    this.form.valueChanges.subscribe(_ => {
      this.formValue = this.form.value as Campaign;
    });
  }

  ngOnInit() {
    this.taquito.accountInfo$.subscribe((accountInfo) => {
      this.ownAddress = accountInfo?.address

      if (this.ownAddress) {
        this.form.controls.owner.controls.address.setValue(this.ownAddress);
        this.tzkt.getUserProfile(this.ownAddress).subscribe(profile => {
          if (profile.exists) {
            if ('alias' in profile) this.form.controls.owner.controls.alias.setValue(profile.alias)
          }
        })
      } else {
        this.form.controls.owner.controls.address.setValue(null)
      }
      
    });
    
    this.tzkt.getCrowdfundingCategories().subscribe(categories => this.availableCategories = categories);

    this.dragAreaClass = "dragarea";
    
  }


  async onSubmit() {

    this.taquito.accountInfo$.subscribe(async (accountInfo) => {
      if (!accountInfo) {
        await this.taquito.requestPermission()
      }

      const loadingDialog = this.openDialog(false, false, '', true)

      const goal = this.formValue.goal * 1000000
      const title = this.formValue.title
      const description = this.formValue.description
      const ascii = this.asciiText
      const category = this.formValue.category

      let url = this.formValue.url;
      if (url && url.indexOf('://') === -1) {
        url = `https://${url}`;
      }
      const finalUrl = url ? new URL(url).href : ''

      await this.taquito.createCampaign(ascii, category, description, goal, title, finalUrl).then(data => {
        data.subscribe(async (originatedAddress: string | object) => {
          // success
          if (typeof originatedAddress == 'string') {
            this.closeDialog(loadingDialog)
            this.router.navigate(['view/' + originatedAddress])
          } else {
            const message = JSON.stringify(originatedAddress)
            this.closeDialog(loadingDialog)
            this.openDialog(true, false, message, false)
          }
        })
      })

    })

  }
 

  openDialog(error: boolean, success: boolean, message: string, disableClose: boolean) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {error: error, success: success, message: message},
      disableClose: disableClose
    });

    return dialogRef
  }

  closeDialog(dialog: { close: () => void; }) {
    dialog.close();
  }


  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.onFileUpload(files);
  }

  onFileUpload(files: FileList) {

    if (files.length > 1) {this.errorFiles = "Please upload only one file"; return} 
  
    this.errorFiles = "";
    const file = files[0]

    const fileSize = ((file.size/1024)/1024)
    const fileType = file.type
    if (fileType != 'image/jpeg' && fileType != 'image/png') {this.errorFiles = "Please upload a PNG or JPEG"; return}
    if (fileSize > 2) {this.errorFiles = "Max 2MB"; return}
    
    const reader = new FileReader()
    reader.onload = (event) => this.img = event.target?.result
    reader.readAsDataURL(file)
    
  }

  onImageLoad(event: Event) {

    this.context = this.myCanvas.nativeElement.getContext('2d');

    // font width smaller than height. ratio is 44 to 80 characters
    // the svg element in the html file has size 44x45 and fontsize 1px
    const [width, height] = [40, 22]
    this.myCanvas.nativeElement.width = width;
    this.myCanvas.nativeElement.height = height;
    
    this.context?.drawImage(event.target as HTMLImageElement, 0, 0, width, height);
    if (this.context) {
      const grayScales = this.convertToGrayScales(this.context, width, height);
      this.drawAscii(grayScales, width);  
    } 

  }


  toGrayScale(r: number, g: number, b: number): number {
    return 0.21 * r + 0.72 * g + 0.07 * b;
  };


  convertToGrayScales(context: CanvasRenderingContext2D, width: number, height: number): number[] {
      const imageData = context.getImageData(0, 0, width, height);

      const grayScales = [];

      for (let i = 0 ; i < imageData.data.length ; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          const grayScale = this.toGrayScale(r, g, b);
          imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

          grayScales.push(grayScale);
      }

      context.putImageData(imageData, 0, 0);

      return grayScales;
  };


  // private grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
  // private grayRamp = '$@B%8&WM#*ZO0QLCJUYX/|()1{}[]?-_+~<>i!lI;:,"^`\'.';
  private grayRamp = '$@B%8&WM#*ZOQLCJUYX/|(){}[]?-_+~<>i!lI;:,"^`\'.';
  private rampLength = this.grayRamp.length;

  getCharacterForGrayScale(grayScale: number) {
    return this.grayRamp[Math.ceil((this.rampLength - 1) * grayScale / 255)];
  }

  drawAscii(grayScales: number[], width: number) {
    
    this.asciiText = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = this.getCharacterForGrayScale(grayScale);
        if ((index + 1) % width === 0) {
            nextChars += '\n';
        }

        return asciiImage + nextChars;
    }, '');

    const asciiArray = this.asciiText.split('\n').slice(0, -1)
    this.form.controls.ascii_array.setValue(asciiArray)

  };


  // TOOLTIP

  joinMissingFieldString() {

    if (this.form.valid) return ''
    else {

      const strings = [
        this.form.controls.title.errors?.['required'] ? 'title' : null,
        this.form.controls.goal.errors?.['required'] ? 'goal' : null,
        this.form.controls.category.errors?.['required'] ? 'category' : null,
        this.form.controls.description.errors?.['required'] ? 'description' : null,
        this.form.controls.ascii_array.errors?.['required'] ? 'ASCII image' : null,
        this.form.controls.url.errors?.['invalidUrl'] ? 'URL' : null
      ].filter(x => x)

      return 'Missing ' + strings.join(", ")
    }
    
  }
  

  // DRAG AND DROP

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.onFileUpload(files);
    }
  }
  
}
