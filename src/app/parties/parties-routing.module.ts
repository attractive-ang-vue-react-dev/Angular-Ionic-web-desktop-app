import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartiesPage } from './parties.page';

const routes: Routes = [
  {
    path: '',
    component: PartiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartiesPageRoutingModule {}
