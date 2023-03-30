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
  funding?: Funding[];
  ascii_array?: string[];
}