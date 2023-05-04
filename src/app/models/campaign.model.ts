import { Funding } from "./funding.model";

export class Campaign {
  goal: number = 0;
  owner: {
    address: string;
    name: string;
  } = {address: '', name: ''};
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

  public constructor(init?: Partial<Campaign>) {
    Object.assign(this, init);
  }
}

export class RestResponse {
  campaignList: Campaign[] = []
} 