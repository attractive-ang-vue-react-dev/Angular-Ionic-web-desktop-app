import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddComponentPage } from './add-component.page';

describe('AddComponentPage', () => {
  let component: AddComponentPage;
  let fixture: ComponentFixture<AddComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddComponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
