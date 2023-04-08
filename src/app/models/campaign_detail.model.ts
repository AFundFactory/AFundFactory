import { Funding } from "./funding.model";

import { Campaign } from './campaign.model';

export class CampaignDetail extends Campaign {
  funding: Funding[] = [];
}

// export class CampaignDetail {
//   goal: number = 0;
//   owner: {
//     address: string;
//     name: string;
//   } = {address: '', name: ''};
//   title: string = '';
//   description: string = '';
//   url: string = '';
//   ascii: string = '';
//   category: string = '';
//   closed: boolean = false
//   contract: string = '';
//   donated: number = 0;
//   version: string = '';
//   creationDate: string = '';
//   funding: Funding[] = [];
//   ascii_array: string[] = [];
// }

export class RestResponseDetail {
  campaignList: CampaignDetail[] = []
} 