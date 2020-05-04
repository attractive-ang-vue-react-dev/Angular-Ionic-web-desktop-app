import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  translationsList:any = null;
  
  constructor(
    private storage: Storage,
    public translate: TranslateService
  ) {
   
    this.storage.get('translations').then((val) => {
      if(val){
        this.translationsList = val;
      }
    });
   }

  async getTranslations(forceUpdate?) {
    if (this.translationsList === null || forceUpdate) {
      this.translationsList = await this.storage.get('translations');
      this.translate.setTranslation('de', this.translationsList);
    }  else {
      this.translate.setTranslation('de', this.translationsList);
    }
    // console.log('translatonlist ',this.translationsList)
  }
  getTranslatedListValue(translationList, unitType, listNames) {
    let translatedUnitType;
    Object.keys(listNames).map(key => {
      if (key == unitType) {
        translatedUnitType = translationList[listNames[key]];
      }
    });
    return translatedUnitType;
  }
  translateText(translateObj, textToTranslate) {
    let translateText;
    if (!!translateObj) {
      Object.keys(translateObj).map(key => {
        if (textToTranslate == key) {
          translateText = translateObj[key];
        }
      });
      return translateText;
    }
  }

  isTranslationAvailable(translateObj, textToTranslate) {
    let isExisted: boolean = false;
    Object.keys(translateObj).map(key => {
      if (textToTranslate == key) {
        isExisted = true;
      }
    });
    return isExisted;
  }

}
