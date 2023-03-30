import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCampaignsComponent } from './explore-campaigns.component';

describe('ExploreCampaignsComponent', () => {
  let component: ExploreCampaignsComponent;
  let fixture: ComponentFixture<ExploreCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreCampaignsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
