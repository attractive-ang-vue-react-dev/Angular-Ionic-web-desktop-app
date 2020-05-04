import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfPreviewPage } from './pdf-preview.page';

const routes: Routes = [
  {
    path: '',
    component: PdfPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfPreviewPageRoutingModule {}
