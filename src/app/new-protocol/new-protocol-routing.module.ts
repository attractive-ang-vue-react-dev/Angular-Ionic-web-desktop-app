import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewProtocolPage } from './new-protocol.page';

const routes: Routes = [
  {
    path: '',
    component: NewProtocolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewProtocolPageRoutingModule {}
