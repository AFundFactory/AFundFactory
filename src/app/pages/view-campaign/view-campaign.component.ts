import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaquitoService } from '../../services/taquito.service'
import { first } from 'rxjs/operators'
import { Funding } from '../../models/funding.model';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo-service.service';
import { TzktService } from 'src/app/services/tzkt.service';
import { Campaign } from 'src/app/models/campaign.model';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss']
})
export class ViewCampaignComponent implements OnInit {

  // FUNDING FORM
  form = new FormGroup({
    amount: new FormControl<number|null>(null, Validators.required)
  });

  // CAMPAIGN DETAILS
  public contractAddress: string | null = null
  public supportUsContract = environment.supportUsContract
  public campaignExists: boolean | undefined = undefined
  public campaign: Campaign = new Campaign()
  private ownAddress: string | undefined
  public isOwner: Boolean = false
  public isGoalMet: boolean = false
  public isClosed: boolean = false

  // FUNDING TABLE
  fundingTable: MatTableDataSource<Funding> = new MatTableDataSource([new Funding])
  pageSizeOptions = [5, 10, 25];
  displayedColumns: string[] = ['date', 'address', 'amount'];
  
  // PAGINATOR: USED SET BECAUSE OF ASYNC DATA
  @ViewChild(MatPaginator) set paginator(pager:MatPaginator) {
    if (pager) this.fundingTable.paginator = pager;
  }

  constructor(
    private taquito: TaquitoService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private tzkt: TzktService,
    private seoService: SeoService
  ) {}


  ngOnInit() {

    this.taquito.accountInfo$.pipe(first()).subscribe((accountInfo) => {
      this.ownAddress = accountInfo?.address
    });
  
    this.route.params.subscribe((params: Params) => {
      this.contractAddress = params['id']

      if (this.contractAddress) {
        this.tzkt.getCampaign(this.contractAddress).subscribe(data => {
        
          if (!data) {this.campaignExists = false; return}
          
          this.campaignExists = true
          this.campaign = data
    
          if (this.campaign.funding) {
            // sort donation table by date desc
            this.campaign.funding.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            // set donation table
            this.fundingTable.data = this.campaign.funding;
            this.fundingTable.paginator = this.paginator
          }
          
    
          this.isOwner = this.ownAddress == this.campaign.owner.address
          this.isGoalMet = this.campaign.donated >= this.campaign.goal
          this.isClosed = this.campaign.closed;
    
          // owner profile
          this.tzkt.getUserProfile(this.campaign.owner.address).subscribe(profile => {
            if (profile.alias) {
              this.campaign.owner.alias = profile.alias
            }
          })
    
          // SEO metadata tags
          const metaTags = [
            {name: 'description', content: this.campaign.description ? this.campaign.description : ''},
            {name: 'og:description', content: this.campaign.description ? this.campaign.description : ''},
            {name: 'twitter:description', content: this.campaign.description ? this.campaign.description : ''},
            {name: 'og:title', content: this.campaign.title ? this.campaign.title : ''},
            {name: 'twitter:title', content: this.campaign.title ? this.campaign.title : ''},
          ]

          this.seoService.updateMetaTags(metaTags);
          
          if (this.campaign.title) {
            this.seoService.updateTitle(this.campaign.title);
          }
    
        });
        
      }
    })

  }


  sendFunds() {

    this.taquito.accountInfo$.subscribe(async (accountInfo) => {
      
      if (!accountInfo) {
        await this.taquito.requestPermission()
      }

      const loadingDialog = this.openDialog(false, false, '', true)
      const amount = this.form.value.amount
      if (this.contractAddress && amount) {
        this.taquito.sendFunds(this.contractAddress, amount).then(([fail, errorMessage]) => {
          if (!fail) {
            const dialogMessage = 'Funds sent, this page will reload in a few seconds'
            this.successDialog(loadingDialog, dialogMessage)
          } else {
            this.failDialog(loadingDialog, errorMessage)
          }
        })
      }
      

    })
  }


  closeCampaign() {

    this.taquito.accountInfo$.subscribe(async (accountInfo) => {
      
      if (!accountInfo) {
        await this.taquito.requestPermission()
      }

      const loadingDialog = this.openDialog(false, false, '', true)
      if (this.contractAddress) {
        this.taquito.closeCampaign(this.contractAddress).then(([fail, errorMessage]) => {
          if (!fail) {
            const dialogMessage = 'Campaign closed, this page will reload in a few seconds'
            this.successDialog(loadingDialog, dialogMessage)
          } else {
            this.failDialog(loadingDialog, errorMessage)
          }
        })
      }
      

    })
  }

  
  successDialog(loadingDialog: MatDialogRef<DialogComponent, any>, message: string) {

    const success = true
    const error = false

    this.closeDialog(loadingDialog)
    this.openDialog(error, success, message, false)

    setTimeout(() => { 
      window.location.reload(); 
    }, 3000);

  }


  failDialog(loadingDialog: MatDialogRef<DialogComponent, any>, errorMessage: any) {

    const success = false
    const error = true
    const message = JSON.stringify(errorMessage)

    this.closeDialog(loadingDialog)
    this.openDialog(error, success, message, false)

  }


  openDialog(error: boolean, success: boolean, message: string, disableClose: boolean) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {error: error, success: success, message: message},
      disableClose: disableClose
    });

    return dialogRef
  }

  closeDialog(dialog: MatDialogRef<DialogComponent, any>) {
    dialog.close();
  }

}
