import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomInnerPage } from './add-room-inner.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomInnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomInnerPageRoutingModule {}
