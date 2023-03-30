import { Component, OnInit } from '@angular/core';
import { IndexerService } from '../../services/indexer.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public lastCampaigns = []

  constructor(private indexer: IndexerService){}

  async ngOnInit() {

    (await this.indexer.getAllCampaigns()).subscribe(res => {
      this.lastCampaigns = res.slice(0, 3)
    })

  }

}
