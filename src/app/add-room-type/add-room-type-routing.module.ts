import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomRoomTypePage } from './add-room-type.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomRoomTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomRoomTypePageRoutingModule {}
