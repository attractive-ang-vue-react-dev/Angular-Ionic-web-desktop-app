import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPageRoutingModule } from './request-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RequestPage } from './request.page';
import { ComponentsModule} from '../components/components.module';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    RequestPageRoutingModule,
    Ng2PanZoomModule,
    PdfViewerModule
  ],
  declarations: [RequestPage]
})
export class RequestPageModule {}
