import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomNewRoomTypePageRoutingModule } from './add-new-room-type-routing.module';

import { AddRoomNewRoomTypePage } from './add-new-room-type.page';
import { ComponentsModule} from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddRoomNewRoomTypePageRoutingModule,
    TranslateModule
  ],
  declarations: [AddRoomNewRoomTypePage]
})
export class AddRoomNewRoomTypePageModule {}
