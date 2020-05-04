import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { RoomsPage } from './rooms.page';
import { ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    RoomsPageRoutingModule
  ],
  declarations: [RoomsPage]
})
export class RoomsPageModule {}
