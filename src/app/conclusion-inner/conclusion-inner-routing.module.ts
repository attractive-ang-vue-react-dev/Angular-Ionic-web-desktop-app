import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConclusionInnerPage } from './conclusion-inner.page';

const routes: Routes = [
  {
    path: '',
    component: ConclusionInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConclusionInnerPageRoutingModule {}
