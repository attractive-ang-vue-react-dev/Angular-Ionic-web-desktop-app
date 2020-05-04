import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartiesInnerPage } from './parties-inner.page';

const routes: Routes = [
  {
    path: '',
    component: PartiesInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartiesInnerPageRoutingModule {}
