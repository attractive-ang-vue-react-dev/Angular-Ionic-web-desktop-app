import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignaturePadComponent } from './signature-pad.component';

describe('SignaturePadComponent', () => {
  let component: SignaturePadComponent;
  let fixture: ComponentFixture<SignaturePadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignaturePadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturePadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
