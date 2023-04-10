import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Profile } from '../models/profile.model'
import { map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TzprofilesService {

  private tzprofilesUrlAPI = environment.tzprofilesUrlAPI
  public walletProfile!: Observable<{ exists: boolean; address: string; alias: string | undefined; }>;

  constructor(private http: HttpClient) { }


  async getWalletProfile(address: string, forceReload: boolean) : Promise<Observable<any>> {
    if (!forceReload && this.walletProfile){
      return of(this.walletProfile) ;
    }

    return (await this.getUserProfile(address)).pipe(tap(profile => {
      this.walletProfile = of({exists: profile.exists, address: address, alias: profile.alias})
    }))
  }
  
  async getUserProfile(address: string) {
    const url = `${this.tzprofilesUrlAPI}/${address}` 

    let profile = new Profile(address)

    return this.http.get<string[][]>(url).pipe(
      map(res => {
      
        res.forEach((x) => {
          const obj = JSON.parse(x[1])
          console.log(obj)
          const context = obj['@context'][1]
          const credentialSubject = obj['credentialSubject']

          if (typeof context == 'string') {
            profile.ethAddress = credentialSubject['address']
            profile.exists = true
          } else {

            if ('TwitterVerification' in context) {
              profile.twitterURL = credentialSubject['sameAs']
              profile.exists = true
            } 
    
            if ('GitHubVerification' in context) {
              profile.githubURL = credentialSubject['sameAs']
              profile.exists = true
            } 
            
            if ('website' in context) {
              profile.description = credentialSubject['description']
              profile.website = credentialSubject['website']
              profile.alias = credentialSubject['alias']
              profile.logoURL = credentialSubject['logo']
              profile.exists = true
            }
          }
        
        })

      return profile
      
      })
    )
    
  }
}
