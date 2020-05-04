import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewProtocolPageRoutingModule } from './new-protocol-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule} from '../components/components.module';

import { NewProtocolPage } from './new-protocol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    NewProtocolPageRoutingModule
  ],
  declarations: [NewProtocolPage]
})
export class NewProtocolPageModule {}
