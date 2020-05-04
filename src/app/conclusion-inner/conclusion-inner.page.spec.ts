import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConclusionInnerPage } from './conclusion-inner.page';

describe('ConclusionInnerPage', () => {
  let component: ConclusionInnerPage;
  let fixture: ComponentFixture<ConclusionInnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConclusionInnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConclusionInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
