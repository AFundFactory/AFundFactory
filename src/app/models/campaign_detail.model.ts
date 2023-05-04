import { Funding } from "./funding.model";
import { Campaign } from './campaign.model';

export class CampaignDetail extends Campaign {
  funding: Funding[] = [];
}

export class RestResponseDetail {
  campaignList: CampaignDetail[] = []
} 