import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomNewRoomTypePage } from './add-new-room-type.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomNewRoomTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomNewRoomTypePageRoutingModule {}
