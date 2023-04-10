import { Injectable } from '@angular/core';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, AccountInfo, BeaconEvent } from '@airgap/beacon-sdk'
import { Store } from '@ngrx/store'
import { State } from 'src/app/app.reducer'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { TzktService } from './tzkt.service';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  
  public network = {
    type: NetworkType.GHOSTNET,
    rpcUrl: 'https://ghostnet.tezos.marigold.dev/'
  }

  private taquito: TezosToolkit = new TezosToolkit(this.network.rpcUrl);
  public wallet: BeaconWallet
  public accountInfo$: Observable<AccountInfo | undefined>
  private _accountInfo: BehaviorSubject<AccountInfo | undefined> = new BehaviorSubject<AccountInfo | undefined>(undefined)

  public contract = environment.contract
  public originatedContract!: string;
  private numBlocks = 1

  public options = {
    name: environment.appName,
    iconUrl: environment.iconForWalletUrl,
    preferredNetwork: this.network.type,
  };

  constructor(
    private readonly store$: Store<State>,
    private tzkt: TzktService
  ) {
    
    this.wallet = new BeaconWallet(this.options)
    this.wallet.client.subscribeToEvent(
      BeaconEvent.ACTIVE_ACCOUNT_SET,
      async (activeAccount: any) => {
        console.log('NEW ACTIVEACCOUNT SET', activeAccount);
      }
    )
    this.taquito.setWalletProvider(this.wallet)

    // Handle aborted event emitted by the SDK
    this.wallet.client.subscribeToEvent(
      BeaconEvent.OPERATION_REQUEST_ERROR,
      (e: any) => {
        console.log(e)
      }
    )

    this.store$
      .select(
        (state: any) => (state as any).app.connectedWallet as AccountInfo | undefined
      )
      .subscribe((accountInfo: any) => {
        this._accountInfo.next(accountInfo)
      })

    this.accountInfo$ = this._accountInfo.asObservable()

  }
  

  // -------AUTH---------

  async setupBeaconWallet(): Promise<AccountInfo | undefined> {
    try {
      return await this.wallet.client.getActiveAccount()
    } catch (error) {
      console.error('Setting up BeaconWallet failed: ', error)
      return undefined
    }
  }

  async requestPermission(): Promise<AccountInfo | undefined> {
    await this.wallet.requestPermissions({ network: this.network })
    return this.wallet.client.getActiveAccount()
  }

  async reset(): Promise<void> {
    return this.wallet.clearActiveAccount()
  }


  // ----- CONTRACT ------  

  async createCampaign(ascii: string, category: string, description: string, goal: number, title: string, url: string) {

    this.taquito.setProvider({ wallet: this.wallet });

    try {
      const result = await this.taquito.wallet.at(this.contract)
        .then((c: any) => c.methods.create_crowdfunding(
            ascii,
            category,
            description,
            goal,
            title,
            url
          )
          .send({ amount: 2 })
      ).then((op: any) => {
        return op.confirmation(this.numBlocks+1).then(async () => {
          return (await this.tzkt.getOriginatedContractAddressFromHash(op.opHash))
        })
      })

      return result
    } catch (e) {
      return of(e)
    }
  
  }


  // ------- INDIVIDUAL CROWDFUNDING CONTRACT ------- 

  async sendFunds(address: string, amount: number) {

    this.taquito.setProvider({ wallet: this.wallet });

    try {
      return await this.taquito.wallet.at(address)
        .then((c: any) => c.methods.send_funds()
          .send({ amount: amount })
      ).then((op: any) => {
        return op.confirmation(this.numBlocks).then(() => {
          return [false, 'success']
        })
      })
    } catch (e) {
      const fail = true
      return [fail, e]
    }
  }


  async closeCampaign(address: string) {

    this.taquito.setProvider({ wallet: this.wallet });

    try {
      return await this.taquito.wallet.at(address)
        .then((c: any) => c.methods.close_campaign()
          .send()
      ).then((op: any) => {
        return op.confirmation(this.numBlocks).then(() => {
          return [false, 'success']
        })
      })
    } catch (e) {
      const fail = true
      return [fail, e]
    }
  }
 
}
