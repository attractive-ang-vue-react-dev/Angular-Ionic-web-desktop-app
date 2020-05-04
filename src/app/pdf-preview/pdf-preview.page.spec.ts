import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdfPreviewPage } from './pdf-preview.page';

describe('PdfPreviewPage', () => {
  let component: PdfPreviewPage;
  let fixture: ComponentFixture<PdfPreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfPreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
