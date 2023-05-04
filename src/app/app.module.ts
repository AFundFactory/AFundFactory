import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { CampaignCardComponent } from './components/campaign-card/campaign-card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CreateCampaignComponent } from './pages/create-campaign/create-campaign.component';
import { ViewCampaignComponent } from './pages/view-campaign/view-campaign.component';
import { ExploreCampaignsComponent } from './pages/explore-campaigns/explore-campaigns.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AboutComponent } from './pages/about/about.component';
import { LegalComponent } from './pages/legal/legal.component';
import { ShortenPipe } from './pipes/shorten.pipe';

import { StoreModule } from '@ngrx/store'
import { reducers, metaReducers } from './reducers'
import { EffectsModule } from '@ngrx/effects'
import { AppEffects } from  './app.effects'
import { ConnectWalletEffects } from './connect-wallet.effects'

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    AppComponent,
    CreateCampaignComponent,
    ViewCampaignComponent,
    ShortenPipe,
    ExploreCampaignsComponent,
    CampaignCardComponent,
    ProfileComponent,
    HomepageComponent,
    AboutComponent,
    DialogComponent,
    LegalComponent,
    CreateCampaignComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    EffectsModule.forRoot([AppEffects, ConnectWalletEffects]),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


