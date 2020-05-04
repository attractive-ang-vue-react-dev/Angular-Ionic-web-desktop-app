import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule} from '../components/components.module';

import { ConclusionInnerPageRoutingModule } from './conclusion-inner-routing.module';

import { ConclusionInnerPage } from './conclusion-inner.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    ConclusionInnerPageRoutingModule
  ],
  declarations: [ConclusionInnerPage]
})
export class ConclusionInnerPageModule {}
