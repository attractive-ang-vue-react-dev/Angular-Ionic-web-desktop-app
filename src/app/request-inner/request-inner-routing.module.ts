import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestInnerPage } from './request-inner.page';

const routes: Routes = [
  {
    path: '',
    component: RequestInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestInnerPageRoutingModule {}
