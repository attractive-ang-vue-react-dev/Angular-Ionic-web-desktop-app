import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfPreviewPageRoutingModule } from './pdf-preview-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPreviewPage } from './pdf-preview.page';

@NgModule({
  imports: [
    PdfViewerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PdfPreviewPageRoutingModule
  ],
  declarations: [PdfPreviewPage]
})
export class PdfPreviewPageModule {}
