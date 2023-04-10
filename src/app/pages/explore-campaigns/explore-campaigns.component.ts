import { Component, OnInit } from '@angular/core';
import { IndexerService } from '../../services/indexer.service';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-explore-campaigns',
  templateUrl: './explore-campaigns.component.html',
  styleUrls: ['./explore-campaigns.component.scss']
})
export class ExploreCampaignsComponent implements OnInit {

  allCampaigns: Campaign[] = []
  campaignList: Campaign[] = []
  searchValue: string = ''
  availableCategories: {value: string, isRefined: boolean}[] = []

  constructor(
    private indexer: IndexerService){}

  async ngOnInit() {

    (await this.indexer.getAllCampaigns()).subscribe(res => {
      this.allCampaigns = res
      this.campaignList = res
    });

    (await this.indexer.getAvailableCategories()).subscribe(categories => {
      categories.forEach(cat => this.availableCategories.push({value: cat, isRefined: false}))
    })
  }

  filterSearch(searchValue: string) {

    this.searchValue = searchValue

    const selectedCat = this.availableCategories.filter(cat => cat.isRefined == true)
    const catList: string[] = []
    selectedCat.forEach(cat => catList.push(cat.value))

    if (catList.length == 0 && searchValue == '') {
      this.campaignList = this.allCampaigns
      return
    }

    if (catList.length == 0 && searchValue != '') {
      this.campaignList = this.applySearchFilter(this.allCampaigns, searchValue)
      return
    } 
    
    if (catList.length > 0 && searchValue == '') {
      this.campaignList = this.applyCatFilter(this.allCampaigns, catList)
      return
    } 
    
    if (catList.length > 0 && searchValue != '') {
      this.campaignList = this.applyCatFilter(this.allCampaigns, catList)
      this.campaignList = this.applySearchFilter(this.campaignList, searchValue)
      return
    }

  }

  applyCatFilter(dataToFilter: Campaign[], catList: string[]) { 
    return dataToFilter.filter(cf => catList.includes(cf.category));
  }

  applySearchFilter(datatoFilter: Campaign[], searchValue: string) { 
    return datatoFilter.filter((cf) => 
      cf.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      cf.description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
  }

  closeSearch() {
    this.searchValue = ''
    this.filterSearch(this.searchValue)
  }

}
