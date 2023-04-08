import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Profile } from '../../models/profile.model'
import { TzprofilesService } from '../../services/tzprofiles.service';
import { IndexerService } from '../../services/indexer.service';
import { Campaign } from 'src/app/models/campaign.model';

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
  public fundedCampaigns: Campaign[] = []

  constructor(
    private route: ActivatedRoute,
    private tzprofile: TzprofilesService,
    private indexer: IndexerService
  ) {}
 
  ngOnInit() {

    this.route.params.subscribe(async (params: Params) => {
      this.profileReady = false
      this.walletAddress = params['id'];
 
      (await this.tzprofile.getUserProfile(this.walletAddress)).subscribe(data => {
        this.profile = data
        this.profileReady = true
      });

      (await this.indexer.getCampaignsByOwner(this.walletAddress)).subscribe(campaignList => {
        this.ownedCampaigns = campaignList
      });

      (await this.indexer.getCampaignsByDonor(this.walletAddress)).subscribe(campaignList => {
        this.fundedCampaigns = campaignList
      })

    })

  }


}
 