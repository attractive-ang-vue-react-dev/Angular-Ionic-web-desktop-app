import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImagePopupPageRoutingModule } from './image-popup-routing.module';
import { ComponentsModule} from '../components/components.module';
import { ImagePopupPage } from './image-popup.page';

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    ImagePopupPageRoutingModule
  ],
  declarations: [ImagePopupPage]
})
export class ImagePopupPageModule {}
