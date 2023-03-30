import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from '../../models/campaign.model'
import { SeoService } from '../../services/seo-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss']
})
export class CampaignCardComponent implements OnInit {

  @Input() campaign: Campaign
  @Input() create: boolean = false
  @Input() view: boolean = false
  @Input() profile: boolean = false
  @Input() homepage: boolean = false

  constructor(
    private seoService: SeoService
  ) {}

  ngOnInit() {

    if (this.view) {

      const metaTags = [
        {name: 'description', content: this.campaign.description},
        {name: 'og:description', content: this.campaign.description},
        {name: 'twitter:description', content: this.campaign.description},
        {name: 'og:title', content: this.campaign.title},
        {name: 'twitter:title', content: this.campaign.title},
      ]

      this.seoService.updateTitle(this.campaign.title);
      this.seoService.updateMetaTags(metaTags);

    }
    
  }  

  getURL(){
    const title = encodeURIComponent(this.campaign.title)
    const url = encodeURIComponent(`${environment.siteURL}/#/view/${this.campaign.contract}`)
    return `https://twitter.com/intent/tweet?url=${url}&text=${title}`
  }

}
