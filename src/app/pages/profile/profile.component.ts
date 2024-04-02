import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Profile } from '../../models/profile.model'
import { Campaign } from 'src/app/models/campaign.model';
import { TzktService } from 'src/app/services/tzkt.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public walletAddress: string = ''
  public profile: Profile = new Profile('')
  public profileReady = false
  public ownedCampaigns: Campaign[] = []
  // public fundedCampaigns: Campaign[] = []

  constructor(
    private route: ActivatedRoute,
    private tzkt: TzktService
  ) {}
 
  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.profileReady = false
      this.walletAddress = params['id'];
 
      this.tzkt.getUserProfile(this.walletAddress).subscribe(data => {
        this.profile = data
        this.profileReady = true
      });

      this.tzkt.getCampaignsByOwner(this.walletAddress).subscribe(campaignList => {
        this.ownedCampaigns = campaignList
      });

      // this.tzkt.getCampaignsByDonor(this.walletAddress)
      // .subscribe(campaignList => {
      //   console.log(campaignList)
      //   this.fundedCampaigns = campaignList
      // })

    })

  }


}
 