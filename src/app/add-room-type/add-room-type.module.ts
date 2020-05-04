import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomRoomTypePageRoutingModule } from './add-room-type-routing.module';

import { AddRoomRoomTypePage } from './add-room-type.page';
import { ComponentsModule} from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddRoomRoomTypePageRoutingModule,
    TranslateModule
  ],
  declarations: [AddRoomRoomTypePage]
})
export class AddRoomRoomTypePageModule {}
