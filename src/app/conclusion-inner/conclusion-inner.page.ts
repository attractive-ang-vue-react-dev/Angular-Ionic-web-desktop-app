import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { IonInput } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';

@Component({
  selector: 'app-conclusion-inner',
  templateUrl: './conclusion-inner.page.html',
  styleUrls: ['./conclusion-inner.page.scss'],
})
export class ConclusionInnerPage implements OnInit {
  @ViewChild(IonInput, { static: false }) inputField: IonInput;
  listHeader:any;
  cityName:any;
  cityNameOld:any;
  constructor(
    private router: Router,
    private storage: Storage,
    private TranslationService: TranslationService,
    private service: SimpleService) {
    this.listHeader = this.TranslationService.translationsList.offline_tool.placeholders.city;
  }
  ionViewWillLeave() {
      if (this.inputField) {
          this.inputField.disabled = true;
      }
  }
  async ionViewWillEnter() {
    this.cityName =await this.storage.get('cityInfo');
    this.cityNameOld =await this.storage.get('cityInfo');
    setTimeout(() => {
        if (this.inputField) {
            this.inputField.disabled = false;
            this.inputField.setFocus();
        }
    }, 500);
  }

ngOnInit() {
  }
  async closeConclusionCity() {
    await  this.storage.set('cityInfo', this.cityName);
    this.router.navigate(['/conclusion']);
  }
  checkAndGoBackToConclusion() {
      if (this.cityName != this.cityNameOld) {
          this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
              this.goBackToConclusion();
          });
      } else {
          this.goBackToConclusion();
      }
  }
  goBackToConclusion() {
    this.router.navigate(['/conclusion']);
  }

}
