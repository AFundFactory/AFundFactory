import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateCampaignComponent } from './pages/create-campaign/create-campaign.component';
import { ViewCampaignComponent } from './pages/view-campaign/view-campaign.component';
import { ExploreCampaignsComponent } from './pages/explore-campaigns/explore-campaigns.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomepageComponent } from './pages/homepage/homepage.component'
import { AboutComponent } from './pages/about/about.component';
import { LegalComponent } from './pages/legal/legal.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    data: {
      seo: {
        title: 'AFundFactory',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'create',
    component: CreateCampaignComponent,
    data: {
      seo: {
        title: 'Create a campaign',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'campaigns',
    component: ExploreCampaignsComponent,
    data: {
      seo: {
        title: 'Campaigns',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      seo: {
        title: 'About',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'legal',
    component: LegalComponent,
    data: {
      seo: {
        title: 'Legal',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'view/:id',
    component: ViewCampaignComponent,
    data: {
      seo: {
        title: 'AFundFactory',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    data: {
      seo: {
        title: 'Profile',
        metaTags: [
          // { name: 'description', content: description },
        ]
      }
    }
  },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }
