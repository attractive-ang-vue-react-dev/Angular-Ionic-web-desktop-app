import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNewComponentPage } from './add-new-component.page';

describe('AddNewComponentPage', () => {
  let component: AddNewComponentPage;
  let fixture: ComponentFixture<AddNewComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewComponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
