import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewComponentPage } from './add-new-component.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewComponentPageRoutingModule {}
