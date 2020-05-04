import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AlertPopupPageRoutingModule } from './alert-popup-routing.module';
import { ComponentsModule} from '../components/components.module';
import { AlertPopupPage } from './alert-popup.page';

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    AlertPopupPageRoutingModule
  ],
  declarations: [AlertPopupPage]
})
export class AlertPopupPageModule {}
