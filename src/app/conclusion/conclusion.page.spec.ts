import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConclusionPage } from './conclusion.page';

describe('ConclusionPage', () => {
  let component: ConclusionPage;
  let fixture: ComponentFixture<ConclusionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConclusionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConclusionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
