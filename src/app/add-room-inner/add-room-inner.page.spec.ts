import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRoomInnerPage } from './add-room-inner.page';

describe('AddRoomInnerPage', () => {
  let component: AddRoomnnerPage;
  let fixture: ComponentFixture<AddRoomInnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomInnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
