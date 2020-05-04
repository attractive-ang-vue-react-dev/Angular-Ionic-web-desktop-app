import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartiesPageRoutingModule } from './parties-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PartiesPage } from './parties.page';
import { ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    PartiesPageRoutingModule
  ],
  providers:[DatePipe],
  declarations: [PartiesPage]
})
export class PartiesPageModule {}
