import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestInnerPageRoutingModule } from './request-inner-routing.module';
import { RequestInnerPage } from './request-inner.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule} from '../components/components.module';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestInnerPageRoutingModule,
    ComponentsModule,
    TranslateModule.forChild(),
    Ng2PanZoomModule,
    PdfViewerModule,
    AngularDraggableModule
  ],
  declarations: [RequestInnerPage]
})
export class RequestInnerPageModule {}