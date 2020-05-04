import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomRoomNamePageRoutingModule } from './add-room-name-routing.module';

import { AddRoomRoomNamePage } from './add-room-name.page';
import { ComponentsModule} from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddRoomRoomNamePageRoutingModule,
    TranslateModule
  ],
  declarations: [AddRoomRoomNamePage]
})
export class AddRoomRoomNamePageModule {}
