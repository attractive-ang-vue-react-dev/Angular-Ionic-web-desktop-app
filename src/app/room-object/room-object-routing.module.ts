import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomObjectPage } from './room-object.page';

const routes: Routes = [
  {
    path: '',
    component: RoomObjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomObjectPageRoutingModule {}
