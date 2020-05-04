import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRoomNewRoomTypePage } from './add-room-new-room-type.page';

describe('AddRoomNewRoomTypePage', () => {
  let component: AddRoomNewRoomTypePage;
  let fixture: ComponentFixture<AddRoomNewRoomTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomNewRoomTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomNewRoomTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
