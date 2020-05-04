import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertPopupPage } from './alert-popup.page';

const routes: Routes = [
  {
    path: '',
    component: AlertPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertPopupPageRoutingModule {}
