import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoomObjectPageRoutingModule } from './room-object-routing.module';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { RoomObjectPage } from './room-object.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    Ng2PanZoomModule,
    PdfViewerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    RoomObjectPageRoutingModule
  ],
  declarations: [RoomObjectPage]
})
export class RoomObjectPageModule {}
