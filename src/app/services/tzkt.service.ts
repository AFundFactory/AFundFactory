import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile.model';
@Injectable({
  providedIn: 'root'
})
export class TzktService {

  private tzktUrlAPI = environment.tzktUrlAPI
  public contract = environment.contract

  constructor(private http: HttpClient) {}


  async getCrowdfundingCategories() {

    return (await this.getContractStorageFieldAPI(this.contract, 'categories')).pipe(
      map((categoryList: string[]) => {
        return categoryList
      }))
  }


  async getContractStorageFieldAPI(address: string, fieldName: string) {
    const url = `${this.tzktUrlAPI}/contracts/${address}/storage/?path=${fieldName}`
    return this.http.get<string[]>(url)
  }


  async getOriginatedContractAddressFromHash(opHash: string) {
    return (await this.getOriginationByHash(opHash)).pipe(
      map((data: any) => {
        return data[0]['originatedContract']['address']
      })
    )

  }

  async getOriginationByHash(opHash: string) {
    const url = `${this.tzktUrlAPI}/operations/originations/${opHash}`
    return this.http.get<Object>(url)
  }


  async getUserProfile(address: string) {
    const url = `${this.tzktUrlAPI}/accounts/${address}` 

    let profile = new Profile(address)

    return this.http.get<object>(url).pipe(
      map(res => {

        console.log(res)
        if ('metadata' in res) {
          const metadata = res['metadata'] as object
          console.log(res['metadata'])
          profile.exists = true

          if ('alias' in metadata) {
            profile.alias = metadata['alias'] as string
          }

          if ('description' in metadata) {
            profile.description = metadata['description'] as string
          }

          if ('github' in metadata) {
            profile.github = metadata['github'] as string
          }

          if ('twitter' in metadata) {
            profile.twitter = metadata['twitter'] as string
          }

          if ('site' in metadata) {
            profile.site = metadata['site'] as string
          }

          // profile.alias = res['metadata']['alias']
        }

        
      
        // res.forEach((x) => {
        //   const obj = JSON.parse(x[1])
        //   const context = obj['@context'][1]
        //   const credentialSubject = obj['credentialSubject']

        //   if (typeof context == 'string') {
        //     profile.ethAddress = credentialSubject['address']
        //     profile.exists = true
        //   } else {

        //     if ('TwitterVerification' in context) {
        //       profile.twitterURL = credentialSubject['sameAs']
        //       profile.exists = true
        //     } 
    
        //     if ('GitHubVerification' in context) {
        //       profile.githubURL = credentialSubject['sameAs']
        //       profile.exists = true
        //     } 
            
        //     if ('website' in context) {
        //       profile.description = credentialSubject['description']
        //       profile.website = credentialSubject['website']
        //       profile.alias = credentialSubject['alias']
        //       profile.logoURL = credentialSubject['logo']
        //       profile.exists = true
        //     }
        //   }
        
        // })

      return profile
      
      })
    )
    
  }
  
}
