import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomRoomNamePage } from './add-room-name.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomRoomNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomRoomNamePageRoutingModule {}
