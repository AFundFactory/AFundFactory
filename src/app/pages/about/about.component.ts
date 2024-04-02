import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface tableElement {
  name: string;
  description: string;
}

const TABLE_DATA: tableElement[] = [
  {
    name: 'Title and description',
    description: 'set the title and a small description for your campaign (no special characters allowed). Keep in mind that this information will be stored in your contract storage - bigger descriptions mean higher transaction costs. Because of that, title and description are limited to 50 and 1000 characters, respectively.'
  },
  {
    name: 'URL (optional)',
    description: 'include an URL that is related to your campaign, if you have one.'
  },
  {
    name: 'Category',
    description: 'choose one of the available categories.'
  },
  {
    name: 'Goal',
    description: "define how much you need for your campaign. No worries if you don't reach the goal, all the funds are transferred to you in the moment they are donated."
  },
  {
    name: 'ASCII image',
    description: 'upload an image (PNG or JPEG with max 2MB) that will be converted into an ASCII image. For optimal formatting, please upload a squared image.'
  },                    
];

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  displayedColumns: string[] = ['name', 'description'];
  dataSource = TABLE_DATA;

  appName = environment.appName
  githubURL = environment.githubURL
}
