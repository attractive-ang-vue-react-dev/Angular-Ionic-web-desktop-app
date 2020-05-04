import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestInnerPage } from './request-inner.page';

describe('RequestInnerPage', () => {
  let component: RequestInnerPage;
  let fixture: ComponentFixture<RequestInnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestInnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
