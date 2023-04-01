import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Campaign } from '../models/campaign.model';
import { RestResponse } from '../models/rest_response.model';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IndexerService {

  private indexerURL = environment.indexerURL
  private allCampaigns: Campaign[]
  private categories: string[]

  constructor(private http: HttpClient) {}


  async getAllCampaigns() {
    const url = `${this.indexerURL}/getAllCampaigns`
    return this.allCampaigns ? of(this.allCampaigns) : this.http.get(url).pipe(map((res: RestResponse) => {
      let campaignList = res.campaignList
      campaignList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      console.log(campaignList);
      this.allCampaigns = campaignList
      return campaignList

    }))
  }


  async getCampaign(contractAddress: string) {
    const url = `${this.indexerURL}/getCampaignByAddress?contract=${contractAddress}`
    return this.http.get(url).pipe(map((res: RestResponse) => {
      console.log(res)
      if (res.campaignList.length == 0) return null
      if (res.campaignList.length > 0) {
        res.campaignList[0].ascii_array = res.campaignList[0].ascii.split('\n').slice(0, -1)
        return res.campaignList[0]
      }
    }))
  }


  async getCampaignsByOwner(address: string) {
    const url = `${this.indexerURL}/getCampaignsByOwner?address=${address}`
    return this.http.get(url).pipe(map((res: RestResponse) => {
      let cfList = res.campaignList
      cfList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      console.log(cfList);
      return cfList

    }))
  }


  async getCampaignsByDonor(address: string) {
    const url = `${this.indexerURL}/getCampaignsByDonor?address=${address}`
    return this.http.get(url).pipe(map((res: RestResponse) => {
      let cfList = res.campaignList
      cfList.forEach(element => {
        element.ascii_array = element.ascii.split('\n').slice(0, -1)
      });
      console.log(cfList);
      return cfList

    }))
  }

  async getAvailableCategories() {
    const url = `${this.indexerURL}/getAvailableCategories`
    return this.categories ? of(this.categories) : this.http.get(url).pipe(map((res: RestResponse) => {
      let cfList = res.campaignList
      let availableCategories = []
      cfList.forEach(cf => {
        availableCategories.push(cf.category)
      });
      this.categories = availableCategories
      return availableCategories

    }))
  }

}
