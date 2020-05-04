import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRoomRoomNamePage } from './add-room-room-name.page';

describe('AddRoomRoomNamePage', () => {
  let component: AddRoomRoomNamePage;
  let fixture: ComponentFixture<AddRoomRoomNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomRoomNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomRoomNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
