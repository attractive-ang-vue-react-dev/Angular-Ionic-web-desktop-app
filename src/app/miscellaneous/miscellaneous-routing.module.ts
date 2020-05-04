import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiscellaneousPage } from './miscellaneous.page';

const routes: Routes = [
  {
    path: '',
    component: MiscellaneousPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscellaneousPageRoutingModule {}
