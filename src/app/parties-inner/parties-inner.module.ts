import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartiesInnerPageRoutingModule } from './parties-inner-routing.module';
import { ComponentsModule} from '../components/components.module';
import { PartiesInnerPage } from './parties-inner.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    PartiesInnerPageRoutingModule
  ],
  declarations: [PartiesInnerPage]
})
export class PartiesInnerPageModule {}
