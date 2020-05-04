import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertPopupPage } from './alert-popup.page';

describe('AlertPopupPage', () => {
  let component: AlertPopupPage;
  let fixture: ComponentFixture<AlertPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
