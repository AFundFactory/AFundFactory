import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Profile } from '../../models/profile.model'
import { TzprofilesService } from '../../services/tzprofiles.service';
import { IndexerService } from '../../services/indexer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public walletAddress: string
  public profile: Profile
  public profileReady = false
  public ownedCampaigns = []
  public fundedCampaigns = []

  constructor(
    private route: ActivatedRoute,
    private tzprofile: TzprofilesService,
    private indexer: IndexerService
  ) {}
 
  ngOnInit() {

    this.route.params.subscribe(async (params: Params) => {
      this.profileReady = false
      this.walletAddress = params.id;
 
      (await this.tzprofile.getUserProfile(this.walletAddress)).subscribe(data => {
        this.profile = data
        this.profileReady = true
      });

      (await this.indexer.getCampaignsByOwner(this.walletAddress)).subscribe(cfList => {
        this.ownedCampaigns = cfList
      });

      (await this.indexer.getCampaignsByDonor(this.walletAddress)).subscribe(cfList => {
        this.fundedCampaigns = cfList
      })

    })

  }


}
 