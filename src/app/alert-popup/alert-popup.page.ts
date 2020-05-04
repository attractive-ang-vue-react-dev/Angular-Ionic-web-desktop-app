import { Component, OnInit } from '@angular/core';
import {NavParams, ModalController } from '@ionic/angular';
import { TranslationService } from '../api/translation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.page.html',
  styleUrls: ['./alert-popup.page.scss'],
})
export class AlertPopupPage implements OnInit {
  alertData: any;
  returnValue: any;
  showOkButton: boolean = false;
  showYesButton: boolean = false;
  showNoButton: boolean = false;
  showStayButton: boolean = false;
  type: any = 'warning';
  message: any = '';
  okayText: any = '';
  constructor(
    private navParams: NavParams,
    public modalController: ModalController,
    public TranslationService: TranslationService,
    public translate: TranslateService
    ) {
    }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.returnValue = true;
    this.alertData = await this.navParams.get('data');
    if (this.alertData.hasOwnProperty('type')) {
      this.type = this.alertData.type;
    }
    if (this.alertData.hasOwnProperty('message')) {
      this.message = this.alertData.message;
    }
    if (this.alertData.hasOwnProperty('showOkButton')) {
      this.showOkButton = this.alertData.showOkButton;
    }
    if (this.alertData.hasOwnProperty('showYesButton')) {
      this.showYesButton = this.alertData.showYesButton;
    }
    if (this.alertData.hasOwnProperty('showNoButton')) {
      this.showNoButton = this.alertData.showNoButton;
    }
    if (this.alertData.hasOwnProperty('showStayButton')) {
      this.showStayButton = this.alertData.showStayButton;
    }

    if (!this.showOkButton && !this.showYesButton && !this.showNoButton && !this.showStayButton) {
        this.showOkButton = true;
    }

    await this.TranslationService.getTranslations();
    if (this.TranslationService.translationsList != null) {
        this.okayText = this.TranslationService.translationsList.offline_tool.labels.okay;
    } else {
        this.okayText = 'Okay';
    }
  }
  clickYes() {
      this.returnValue = true;
      this.closeModal();
  }
  clickNo() {
      this.returnValue = false;
      this.closeModal();
  }
  closeModal() {
    this.modalController.dismiss(this.returnValue);
  }

}
