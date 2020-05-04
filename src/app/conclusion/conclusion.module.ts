import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';

import { IonicModule } from '@ionic/angular';

import { ConclusionPageRoutingModule } from './conclusion-routing.module';

import { ConclusionPage } from './conclusion.page';
import { ComponentsModule} from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	entryComponents: [],
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	ComponentsModule,
	SignaturePadModule,
	ConclusionPageRoutingModule,
	TranslateModule
	],
	providers:[DatePipe],
	declarations: [ConclusionPage],
	
})
export class ConclusionPageModule {}
