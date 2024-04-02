import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile.model';
import { Campaign, TzktResponseCampaign } from '../models/campaign.model';
import { Observable, combineLatest, forkJoin, of } from 'rxjs';
import { Funding, TzktResponseFunding } from '../models/funding.model';
@Injectable({
  providedIn: 'root'
})
export class TzktService {

  private tzktUrlAPI = environment.tzktUrlAPI
  private contract = environment.contract
  private allCampaigns: Campaign[] = []

  constructor(private http: HttpClient) {}


  getAllCampaigns() {

    return this.allCampaigns.length > 0 ? of(this.allCampaigns) : this.getBigmapOfContract(this.contract, 'campaign_list')
    .pipe(
      switchMap(campaignAddressRes => {

        const campaignAddressList = campaignAddressRes.map(res => res['key'])
        const observables: Observable<Funding[]>[] = campaignAddressList.map(address => 
          this.getCampaignFunding(address)
        );

        return combineLatest([
          this.getCampaignsContractStorage(campaignAddressList),
          ...observables
        ]).pipe(
          map(([campaignListRes, ...funding]) => {
            campaignListRes.forEach((campaignRes, index) => {

              const campaign = new Campaign().fromTzkt(campaignRes, campaignRes.address)
              campaign.funding = funding[index]
              campaign.donated = funding[index].reduce((sum, current) => sum + current.amount, 0);
              this.allCampaigns.push(campaign)

            })
            return this.allCampaigns
  
          })
        )
        
      }),
    );
    
  }


  getCampaign(contractAddress: string) {
    const availableCampaign = this.allCampaigns.find(campaign => campaign.contract == contractAddress)
    return availableCampaign ? of(availableCampaign) : this.getCampaignsContractStorage([contractAddress]).pipe(
      switchMap(campaignRes => {
        const campaign = new Campaign().fromTzkt(campaignRes[0], contractAddress)
        return this.getCampaignFunding(contractAddress).pipe(map(funding => {
          if (funding) {
            campaign.funding = funding
            campaign.donated = funding.reduce((sum, current) => sum + current.amount, 0);
          } else {
            campaign.funding = []
            campaign.donated = 0
          }

          return campaign
          
        }))
      })
    )
  }


  getCampaignsByOwner(address: string) {
    const url = `${this.tzktUrlAPI}/contracts/${this.contract}/bigmaps/campaign_list/keys?value=${address}`
    return this.allCampaigns.length > 0 ? of(this.allCampaigns.filter(campaign => campaign.owner.address == address)) : this.http.get<any[]>(url).pipe(
      switchMap((res) => {

        const observables: Observable<Campaign>[] = res.map(item => 
          this.getCampaign(item['key'])
        );

        return forkJoin(
          observables
        ).pipe(map(campaigns => campaigns));
      })
    )
  }


  getCampaignFunding(campaignAddress: string) {

    const url = `${this.tzktUrlAPI}/operations/transactions/?target=${campaignAddress}`
    return this.http.get<TzktResponseFunding[]>(url).pipe(map(res => {
      let funding: Funding[] = []
      res.forEach(transaction => {
        funding.push(new Funding().fromTzkt(transaction))
      })
      return funding
    }))
  }

  getCrowdfundingCategories() {

    return this.getContractStorageField(this.contract, 'categories').pipe(
      map((categoryList: string[]) => {
        return categoryList
      }))
  }

  getCampaignsContractStorage(addressList: string[]) {

    const campaingListString = addressList.join(',')
    const url = `https://api.tzkt.io/v1/contracts?address.in=${campaingListString}&includeStorage=true`
    return this.http.get<TzktResponseCampaign[]>(url)
  }

  getContractStorageField(address: string, fieldName: string) {
    const url = `${this.tzktUrlAPI}/contracts/${address}/storage/?path=${fieldName}`
    return this.http.get<string[]>(url)
  }

  getBigmapOfContract(address: string, bigmapName: string) {
    const url = `${this.tzktUrlAPI}/contracts/${address}/bigmaps/${bigmapName}/keys`
    return this.http.get<any[]>(url)
  }


  async getOriginatedContractAddressFromHash(opHash: string) {
    return this.getOriginationByHash(opHash).pipe(
      map((data: any) => {
        return data[0]['originatedContract']['address']
      })
    )

  }

  getOriginationByHash(opHash: string) {
    const url = `${this.tzktUrlAPI}/operations/originations/${opHash}`
    return this.http.get<Object>(url)
  }


  getUserProfile(address: string) {
    const url = `${this.tzktUrlAPI}/accounts/${address}` 

    let profile = new Profile(address)

    return this.http.get<object>(url).pipe(
      map(res => {

        if ('metadata' in res) {
          const metadata = res['metadata'] as object

          let profile = new Profile(address, metadata)
          profile.exists = true

          return profile
        }

        return profile
      
      })
    )
    
  }


  
}
