import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewProtocolPage } from './new-protocol.page';

describe('NewProtocolPage', () => {
  let component: NewProtocolPage;
  let fixture: ComponentFixture<NewProtocolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProtocolPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewProtocolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
