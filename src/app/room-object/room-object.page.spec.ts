import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomObjectPage } from './room-object.page';

describe('RoomObjectPage', () => {
  let component: RoomObjectPage;
  let fixture: ComponentFixture<RoomObjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomObjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomObjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
