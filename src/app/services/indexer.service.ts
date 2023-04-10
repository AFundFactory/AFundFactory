import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Campaign, RestResponse } from '../models/campaign.model';
import { RestResponseDetail } from '../models/campaign_detail.model';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IndexerService {

  private indexerURL = environment.indexerURL
  private allCampaigns: Campaign[] = []
  private categories: string[] = []

  constructor(private http: HttpClient) {}


  async getAllCampaigns() {
    const url = `${this.indexerURL}/getAllCampaigns`
    return this.allCampaigns.length > 0 ? of(this.allCampaigns) : this.http.get<RestResponse>(url).pipe(map(res => {
      let campaignList = res.campaignList
      campaignList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      this.allCampaigns = campaignList
      return campaignList

    }))
  }


  async getCampaign(contractAddress: string) {
    const url = `${this.indexerURL}/getCampaignByAddress?contract=${contractAddress}`
    return this.http.get<RestResponseDetail>(url).pipe(map(res => {
      if (res.campaignList.length == 0) return null

      res.campaignList[0].ascii_array = res.campaignList[0].ascii.split('\n').slice(0, -1)
      return res.campaignList[0]
    }))
  }


  async getCampaignsByOwner(address: string) {
    const url = `${this.indexerURL}/getCampaignsByOwner?address=${address}`
    return this.http.get<RestResponse>(url).pipe(map(res => {
      let campaignList = res.campaignList
      campaignList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      return campaignList

    }))
  }


  async getCampaignsByDonor(address: string) {
    const url = `${this.indexerURL}/getCampaignsByDonor?address=${address}`
    return this.http.get<RestResponse>(url).pipe(map(res => {
      let campaignList = res.campaignList
      campaignList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      return campaignList

    }))
  }

  
  async getAvailableCategories() {
    const url = `${this.indexerURL}/getAvailableCategories`
    return this.categories.length > 0 ? of(this.categories) : this.http.get<RestResponse>(url).pipe(map(res => {
      let campaignList = res.campaignList
      let availableCategories: string[] = []
      campaignList.forEach(campaign => {
        availableCategories.push(campaign.category)
      });
      this.categories = availableCategories
      return availableCategories

    }))
  }

}
