import { Funding } from "./funding.model";

export class Campaign {
  goal: number = 0;
  owner: {
    address: string;
    alias: string;
  } = {address: '', alias: ''};
  title: string = '';
  description: string = '';
  url: string = '';
  ascii: string = '';
  category: string = '';
  closed: boolean = false
  contract: string = '';
  donated: number = 0;
  version: string = '';
  creationDate: string = '';
  ascii_array: string[] = [];
  funding?: Funding[]

  public constructor(init?: Partial<Campaign>) {
    Object.assign(this, init);
  }

  fromTzkt(input: TzktResponseCampaign, contractAddress: string): this {

    this.goal = input.storage.goal;
    this.owner = {
      address: input.storage.owner,
      alias: ''
    };
    this.title = input.storage.title;
    this.description = input.storage.description;
    this.url = input.storage.url;
    this.ascii = input.storage.ascii;
    this.category = input.storage.category;
    this.closed = input.storage.closed;
    this.contract = contractAddress;
    this.donated = 0;
    this.version = input.storage.version;
    this.creationDate = input.firstActivityTime;
    this.ascii_array = input.storage.ascii.split('\n').slice(0, -1);
    return this;
  }
}

// export class RestResponse {
//   campaignList: Campaign[] = []
// } 


export class TzktResponseCampaign {
  firstActivityTime: string = ''
  address: string = ''
  storage!: {
    goal: number;
    owner: string;
    title: string;
    description: string;
    url: string;
    ascii: string;
    category: string;
    closed: boolean;
    version: string;
  }
} 
