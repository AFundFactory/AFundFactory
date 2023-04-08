import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
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
    console.log(opHash)
    return (await this.getOriginationByHash(opHash)).pipe(
      map((data: any) => {
        console.log(data)
        return data[0]['originatedContract']['address']
      })
    )

  }

  async getOriginationByHash(opHash: string) {
    const url = `${this.tzktUrlAPI}/operations/originations/${opHash}`
    return this.http.get<Object>(url)
  }
  
}
