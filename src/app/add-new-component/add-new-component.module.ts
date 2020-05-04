import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewComponentPageRoutingModule } from './add-new-component-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddNewComponentPage } from './add-new-component.page';
import { ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    AddNewComponentPageRoutingModule
  ],
  declarations: [AddNewComponentPage]
})
export class AddNewComponentPageModule {}
