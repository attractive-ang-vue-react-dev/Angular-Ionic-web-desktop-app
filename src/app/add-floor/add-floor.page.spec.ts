import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddFloorPage } from './add-floor.page';

describe('AddFloorPage', () => {
  let component: AddFloorPage;
  let fixture: ComponentFixture<AddFloorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFloorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFloorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
