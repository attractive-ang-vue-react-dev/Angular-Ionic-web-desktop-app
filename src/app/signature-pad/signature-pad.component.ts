import { Component, OnInit,ViewChild,Input } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import {PopoverController} from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ObservableService } from '../api/observable.service';
@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent implements OnInit {

  @ViewChild(SignaturePad,{'static':false}) signaturePad: SignaturePad;
  @Input() type: string;
  signatureType:any;
  currentSession: any;
  signature: any;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 350,
  };

  constructor(public popoverController: PopoverController,
    private navParams: NavParams,
    public observableService: ObservableService) {
    this.signatureType = this.navParams.get('type');
  }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  async DismissClick(signature) {
    await this.popoverController.dismiss(signature);
  }

  async drawComplete() {
    this.signature = this.signaturePad.toDataURL();
    // setTimeout(() => {
      this.DismissClick(this.signature);
    // }, 200);
  }	

  drawStart() {
  }

  clearSignature(){
    this.signaturePad.clear();
  }

}
