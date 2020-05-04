import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartiesInnerPage } from './parties-inner.page';

describe('PartiesInnerPage', () => {
  let component: PartiesInnerPage;
  let fixture: ComponentFixture<PartiesInnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesInnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PartiesInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
