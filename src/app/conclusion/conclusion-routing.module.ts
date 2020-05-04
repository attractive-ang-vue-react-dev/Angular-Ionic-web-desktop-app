import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConclusionPage } from './conclusion.page';

const routes: Routes = [
  {
    path: '',
    component: ConclusionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConclusionPageRoutingModule {}
