import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImagePopupPage } from './image-popup.page';

describe('ImagePopupPage', () => {
  let component: ImagePopupPage;
  let fixture: ComponentFixture<ImagePopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
