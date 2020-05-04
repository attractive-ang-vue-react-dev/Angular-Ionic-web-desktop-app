import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddComponentPageRoutingModule } from './add-component-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddComponentPage } from './add-component.page';
import { ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    AddComponentPageRoutingModule
  ],
  declarations: [AddComponentPage]
})
export class AddComponentPageModule {}
