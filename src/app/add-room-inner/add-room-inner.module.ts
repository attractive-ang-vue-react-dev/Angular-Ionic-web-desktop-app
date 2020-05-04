import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomInnerPageRoutingModule } from './add-room-inner-routing.module';
import { ComponentsModule} from '../components/components.module';
import { AddRoomInnerPage } from './add-room-inner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddRoomInnerPageRoutingModule
  ],
  declarations: [AddRoomInnerPage]
})
export class AddRoomInnerPageModule {}
