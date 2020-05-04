import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRoomRoomTypePage } from './add-room-room-type.page';

describe('AddRoomRoomTypePage', () => {
  let component: AddRoomRoomTypePage;
  let fixture: ComponentFixture<AddRoomRoomTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomRoomTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomRoomTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
