import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagePopupPage } from './image-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ImagePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagePopupPageRoutingModule {}
