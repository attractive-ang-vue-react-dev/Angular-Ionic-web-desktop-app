import { Component, OnInit, ViewChild } from '@angular/core';
import {NavParams, ModalController, IonSlides } from '@ionic/angular';
import { TranslationService } from '../api/translation.service';
@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.page.html',
  styleUrls: ['./image-popup.page.scss'],
})
export class ImagePopupPage implements OnInit {
  currentIndex:any;
  imagesData: any;
  showPager: any;
  sliderOptions = {
    initialSlide: this.currentIndex
  }
  @ViewChild('mySlider', { 'static': false }) slider: IonSlides;  
  constructor(
    private navParams: NavParams,
    public modalController: ModalController,
    public TranslationService: TranslationService,
    ) {

    }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.imagesData = this.navParams.get('data');
    this.currentIndex = this.imagesData.index;
    this.showPager = false;
    if (this.imagesData.hasOwnProperty('images')) {
        if (this.imagesData.images.length > 1) {
            this.showPager = true;
        }
    }
    await this.TranslationService.getTranslations();
    // this.slider.getSlider().update();
    this.slider.update();
    this.slider.slideTo(this.currentIndex, 0);
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
