import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SimpleService } from './api/simple-service.service';
import { AuthService } from './api/auth.service';
import { RouterExtService } from './api/router-ext.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
// import { SortByTypeComponent } from './sort-by-type/sort-by-type.component';
import { Camera } from '@ionic-native/camera/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPreviewPageModule } from './pdf-preview/pdf-preview.module';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { ImagePopupPageModule } from './image-popup/image-popup.module';
import { AlertPopupPageModule } from './alert-popup/alert-popup.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  declarations: [AppComponent, SignaturePadComponent],
  entryComponents: [SignaturePadComponent],
  imports: [Ionic4DatepickerModule,TranslateModule.forRoot(),BrowserModule,IonicStorageModule.forRoot(),SignaturePadModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule, PdfViewerModule, PdfPreviewPageModule, Ng2PanZoomModule,ImagePopupPageModule, AlertPopupPageModule],
  providers: [
  Camera,
  HttpClient,
  DatePicker,
  SimpleService,
  AuthService,
  RouterExtService,
  StatusBar,
  File,
  FileOpener,


  SplashScreen,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  exports: [
    
],
})
export class AppModule {}
