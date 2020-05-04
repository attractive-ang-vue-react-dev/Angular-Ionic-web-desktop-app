import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFloorPageRoutingModule } from './add-floor-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule} from '../components/components.module';
import { AddFloorPage } from './add-floor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    AddFloorPageRoutingModule
  ],
  declarations: [AddFloorPage]
})
export class AddFloorPageModule {}
