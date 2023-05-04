import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaquitoService } from '../../services/taquito.service'
import { TzprofilesService } from '../../services/tzprofiles.service';
import { CampaignDetail } from 'src/app/models/campaign_detail.model';
import { first } from 'rxjs/operators'
import { Funding } from '../../models/funding.model';
import { IndexerService } from '../../services/indexer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss']
})
export class ViewCampaignComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form = new FormGroup({
    amount: new FormControl<number|null>(null, Validators.required)
  });

  public contractAddress: string | null = null
  public supportUsContract = environment.supportUsContract
  public campaignExists: boolean | undefined = undefined
  public campaign: CampaignDetail = new CampaignDetail()

  private ownAddress: string | undefined
  public isOwner: Boolean = false
  public isGoalMet: boolean = false
  public isClosed: boolean = false

  // DONATIONS TABLE
  pageSize = 5;
  numDonations: number = 0
  donationTable: MatTableDataSource<Funding> = new MatTableDataSource([new Funding])
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  displayedColumns: string[] = ['date', 'address', 'amount'];

  constructor(
    private taquito: TaquitoService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private tzprofile: TzprofilesService,
    private indexer: IndexerService,
  ) {}

  async ngOnInit() {

    this.taquito.accountInfo$.pipe(first()).subscribe((accountInfo) => {
      this.ownAddress = accountInfo?.address
    });
  
    this.route.params.subscribe(async (params: Params) => {
      this.contractAddress = params['id']

      if (this.contractAddress) {
        (await this.indexer.getCampaign(this.contractAddress)).subscribe(async data => {
        
          if (!data) {this.campaignExists = false; return}
          
          this.campaignExists = true
          this.campaign = data
    
          this.numDonations = this.campaign.funding.length
          this.donationTable = new MatTableDataSource(this.campaign.funding);
          this.donationTable.paginator = this.paginator
    
          this.isOwner = this.ownAddress == this.campaign.owner.address
          this.isGoalMet = this.campaign.donated >= this.campaign.goal
          this.isClosed = this.campaign.closed
    
          ;(await this.tzprofile.getUserProfile(this.campaign.owner.address)).subscribe(profile => {
            if (profile.alias) {
              this.campaign.owner.name = profile.alias
            }
          })
    
          console.log(this.campaign)
    
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


  handlePageEvent(event: PageEvent) {
    this.numDonations = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

}
