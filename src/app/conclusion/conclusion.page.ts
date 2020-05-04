import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TranslateService } from '@ngx-translate/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';
import { Storage } from '@ionic/storage';
import { PdfPreviewPage } from '../pdf-preview/pdf-preview.page';
import { SimpleService } from '../api/simple-service.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../api/translation.service';
import { ObservableService } from '../api/observable.service';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';


@Component({
  selector: 'app-conclusion',
  templateUrl: './conclusion.page.html',
  styleUrls: ['./conclusion.page.scss'],
})
export class ConclusionPage implements OnInit {
  currentSignatureType: any;
  incomingResSign: any;
  outgoingResSign: any;
  tuCuSign: any;
  RSCSign: any;
  houseOwnerSign: any;
  residentSign: any;
  serviceProviderSign: any;
  city: string = "";
  conclusionDate: string;
  currentSession: any;
  currentProtocolId:number;
  currentProtocolName: any;
  submitData: any;
  currentIndex: any;
  pdfObj = null;
  residents: any = [];
  movingOuts: any = [];
  quartersData: any = [];
  units: any = [];
  buildings: any = [];
  translations: any = {};
  fortimoLogo: any;
  costImpacts: any = [];
  actions: any = [];
  locations: any = [];
  filteredMiscKeys:any;
  emptyObjectImg: string;
  serviceProviders: any = [];
  pdfPreview: boolean = false;
  pdfPreviewClicked: boolean = false;
  @ViewChild(SignaturePad, { 'static': false }) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 100,
    'canvasHeight': 200,
    'backgroundColor': 'rgb(255,255,255)',
  };

  constructor(private router: Router,
    public datePipe: DatePipe,
    public popoverController: PopoverController,
    public modalController: ModalController,
    private datePicker: DatePicker,
    private storage: Storage,
    private service: SimpleService,
    private translate: TranslateService,
    public TranslationService: TranslationService,
    public http: HttpClient,
    public observableService: ObservableService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.emptyObjectImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }

  getComponentImage(nonOkayComponent, height50, width50, roomcompMagrin) {
    return [
      {
        rowSpan: !!nonOkayComponent.inspection_images && nonOkayComponent.inspection_images.length > 0 ? 5 : 0,
        height: !!nonOkayComponent.inspection_images &&nonOkayComponent.inspection_images.length > 0 ? height50 : 0,
        width: !!nonOkayComponent.inspection_images && nonOkayComponent.inspection_images.length > 0 ? width50 : 0,
        image: !!nonOkayComponent.inspection_images && nonOkayComponent.inspection_images.length > 0 ? nonOkayComponent.inspection_images[0].img : this.emptyObjectImg,
        margin: !!nonOkayComponent.inspection_images && nonOkayComponent.inspection_images.length > 0 ? roomcompMagrin : [1, 0, 0, 4]
      },
      '',
    ]
  }
  getRoomTitle(nonOkayComponents, i, lightred) {
  
   return [
      '',
      {
        text: [nonOkayComponents[i].category_id == '' ? '' : this.getCurrentRequest(nonOkayComponents[i]).mainlabel + nonOkayComponents[i].request.currentComponent],
        // color: '#91063E',
        color: lightred,
        // margin: defectMargin,
        margin: [!!nonOkayComponents[i].request.inspection_images
        && nonOkayComponents[i].request.inspection_images.length >0 ? -1.5: -10, 
        !!nonOkayComponents[i].request.inspection_images
        && nonOkayComponents[i].request.inspection_images.length >0 ? 0 : -5, 0, 0],
        bold: false,

      },
    ];
  }

  getFloorTitle(nonOkayComponents, i, lightred) {
  
    return [
      '',
      {
        text: [nonOkayComponents[i].category_id == '' ? '' : this.getCurrentRequest(nonOkayComponents[i]).mainlabel + this.getLocationName(nonOkayComponents[i])],//nonOkayComponents[i].request.currentComponent],
        // color: '#91063E',
        color: lightred,
        // margin: defectMargin,
        margin: [!!nonOkayComponents[i].inspection_images
        && nonOkayComponents[i].inspection_images.length >0 ? -1.5: -10, !!nonOkayComponents[i].inspection_images
        && nonOkayComponents[i].inspection_images.length >0 ? 0 : -5, 0, 0],
        bold: false,

      },
    ];
   }

  processEmptyRows(componentsTableBody) {
    const rows = componentsTableBody.table.body;
    let nonEmptyRows = [];
    nonEmptyRows.push(rows[0]);
    let emptyRows = [];
    for (let rIdx = 1; rIdx < rows.length; rIdx++) {
      const element = rows[rIdx];
      const text = element[1].text[0];
      if(text !== '\t') {
        nonEmptyRows.push(element);
      } else {
        emptyRows.push(element);
      }
    }
    return nonEmptyRows.concat(emptyRows);
  }

  /**
   * method to remove empty rows from both rooms left section and right section
   * @param componentsLeftTableBody room left section table rows
   * @param componentsRightTableBody room right section table rows
   */
  deleteEmptyRowsFromBothSection(componentsLeftTableBody, componentsRightTableBody) {
    let leftTable = componentsLeftTableBody.table.body;
    let rightTable = componentsRightTableBody.table.body;
    let removeIndexArray = [];
    // finding left section table empty row
    leftTable.filter(function(elem, index) {
      if(index > 0) {
        const leftRowText = elem[1].text[0];
        if(leftRowText == '\t') {
          // finding right section table empty row and check same index then push to separate array
          rightTable.filter(function(rightElement, rightIndex) {
            if(rightIndex > 0) {
              const rowText = rightElement[1].text[0];
              if(rowText == '\t') {
                if(rightIndex === index) {
                  removeIndexArray.push(index);
                }
              }
            }
            return rightElement;
          });
        }
      }
    });
    removeIndexArray.sort().reverse();
    // removing each empty object from both left and right section tables
    for (let i = 0; i <= removeIndexArray.length -1; i++) {
      leftTable.splice(removeIndexArray[i],1);
      rightTable.splice(removeIndexArray[i],1);
    }
    // returning updated array
    return [leftTable, rightTable];
  }

  marginBottomRow(componentLeft, componentRight){
    let marginLeft = componentLeft[componentLeft.length - 1][1].margin[3] = componentLeft[componentLeft.length - 1][1].margin[3] + 5;
    let marginRight = componentRight[componentRight.length -1][1].margin[3] = componentRight[componentRight.length - 1][1].margin[3] + 5;
  }

  getComponentRowText(componentInfo, title, value, lightblack, lavenderBlush, suvaGrey) {
    if(title === "") {
      title = '\t';
      value = '\t';
    }
    return [
      '',
      {
        text: [
          title,
          {
            text: value,
            color: suvaGrey,
            fillColor: lavenderBlush,
            italics: true,
          }],

        color: lightblack,
        margin: [!!componentInfo.inspection_images && componentInfo.inspection_images.length > 0 ? -1.5: -10, -5, 0, 0]
      },
    ];
  }
  async ionViewWillEnter() {

    this.TranslationService.getTranslations();
    this.storage.get('current_protocol').then((val) => {
			if(val) {
			  this.currentProtocolName = val.name;
			}
    });
    
    this.locations = await this.storage.get('locations');
    
    var submitData;
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
    submitData = await this.storage.get('submit_data');
    let currentSessionId = await this.storage.get('current_index');
    this.observableService.isRoomsChanged = false;
    let links = await this.storage.get('links');
    links = this.observableService.modifyLinks(links, 5, submitData[currentSessionId].rooms);
    this.observableService.setLinks(links);
    if (submitData) {
      this.currentSession = submitData[currentSessionId];
      if (submitData[currentSessionId].conclusion.date != '') {
        this.conclusionDate = submitData[currentSessionId].conclusion.date;
      }
      this.incomingResSign = submitData[currentSessionId].conclusion.signature.incoming;
      this.outgoingResSign = submitData[currentSessionId].conclusion.signature.outgoing;
      this.tuCuSign = submitData[currentSessionId].conclusion.signature.tu_gu;
      this.RSCSign = submitData[currentSessionId].conclusion.signature.real_estate_company;
      this.houseOwnerSign = submitData[currentSessionId].conclusion.signature.house_owner;
      this.residentSign = submitData[currentSessionId].conclusion.signature.resident;
      this.serviceProviderSign = submitData[currentSessionId].conclusion.signature.service_provider;
      this.residents = await this.storage.get('residents');
      this.movingOuts = await this.storage.get('moving_outs');
      this.quartersData = await this.storage.get('quarters');
      this.units = await this.storage.get('units');
      this.translations = await this.storage.get('translations');
      this.serviceProviders = await this.storage.get('service_providers');
      this.fortimoLogo = "data:image/png;base64,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";
      // let radikalFonts = await Promise.all([this.http.get('assets/text-fonts-base64/RadikalW03-Regular-Base64.txt', {responseType: 'text'}).toPromise(),
      // this.http.get('assets/text-fonts-base64/RadikalW03-Bold-Base64.txt', {responseType: 'text'}).toPromise()]);
      // pdfMake.vfs["RadikalW03-Regular.ttf"] = radikalFonts[0]; // Radikal regular fonts
      // pdfMake.vfs["RadikalW03-Bold.ttf"] = radikalFonts[1]; // Radikal bold fonts
      let robotoFonts = await Promise.all([this.http.get('assets/text-fonts-base64/Roboto-Light-Base64.txt', { responseType: 'text' }).toPromise(),
      this.http.get('assets/text-fonts-base64/Roboto-Bold-Base64.txt', { responseType: 'text' }).toPromise(), this.http.get('assets/text-fonts-base64/Roboto-Regular-Base64.txt', { responseType: 'text' }).toPromise()]);
      pdfMake.vfs["Roboto-Light.ttf"] = robotoFonts[0];
      pdfMake.vfs["Roboto-Bold.ttf"] = robotoFonts[1];
      pdfMake.vfs["Roboto-Regular.ttf"] = robotoFonts[2];
      this.costImpacts = await this.storage.get('cost_impact');
      this.actions = await this.storage.get('action');
      let cityInfo = await this.storage.get('cityInfo');
      // cityInfo = 'St. Gallen';
      
      if (!!cityInfo) {
        this.city = cityInfo;
      } else {
        let cities:any = [];
        cities = submitData[currentSessionId].conclusion.city.split(",");
        this.city = "";
        cities.map((currentCityName, index) => {
          let selectedQuarter = this.quartersData.find(item => item.city == currentCityName.trim());
          if (!!selectedQuarter) {
          this.city += selectedQuarter.zip + ' ';
          this.city += currentCityName.trim();
          this.city += cities.length-1 != index ? ', ' : '';
          }
        });
      }
    }
    await this.service.hideLoader();
  }
  ionViewDidLeave() {
    localStorage.setItem('pageLoad', null);
  }

  setSignatureValue(signatureType, signatureValue) {
    if (signatureType == 'incoming') {
      this.incomingResSign = signatureValue;
    } else if (signatureType == 'outgoing') {
      this.outgoingResSign = signatureValue;
    } else if (signatureType == 'tu_gu') {
      this.tuCuSign = signatureValue;
    } else if (signatureType == 'real_estate_company') {
      this.RSCSign = signatureValue;
    } else if (signatureType == 'house_owner') {
      this.houseOwnerSign = signatureValue;
    } else if (signatureType == 'service_provider') {
      this.serviceProviderSign = signatureValue;
    } else if (signatureType == 'resident') {
      this.residentSign = signatureValue;
    }
  }

  async openDatePicker() {
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
        'objConfig': this.service.getdatePickerObj(), 
        'selectedDate': this.conclusionDate 
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss()
    .then((data) => {
      if(data.data.date!="Invalid date"){
        this.conclusionDate = data.data.date;
        this.SetDate();
      }
    });
  }

  async saveSignatureSubmitData() {
    const current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    if(this.incomingResSign && this.incomingResSign != '') {
      submit_data[current_index].conclusion.signature.incoming = this.incomingResSign;
    }
    if(this.outgoingResSign && this.outgoingResSign != '') {
      submit_data[current_index].conclusion.signature.outgoing = this.outgoingResSign;
    }
    if(this.tuCuSign && this.tuCuSign != '') {
      submit_data[current_index].conclusion.signature.tu_gu = this.tuCuSign;
    }
    if(this.RSCSign && this.RSCSign != '') {
      submit_data[current_index].conclusion.signature.real_estate_company = this.RSCSign;
    }
    if(this.houseOwnerSign && this.houseOwnerSign != '') {
        submit_data[current_index].conclusion.signature.house_owner = this.houseOwnerSign;
    }
    if(this.serviceProviderSign && this.serviceProviderSign != '') {
        submit_data[current_index].conclusion.signature.service_provider = this.serviceProviderSign;
    }
    if(this.residentSign && this.residentSign != '') {
      submit_data[current_index].conclusion.signature.resident = this.residentSign;
  }
    await this.storage.set('submit_data', submit_data);
    this.currentSession = submit_data[current_index];
    return true;
  }



  async presentPopover(typeOfSignature: any) {
    this.currentSignatureType = typeOfSignature;
    const popover = await this.popoverController.create({
      component: SignaturePadComponent,
      componentProps: { 'type': typeOfSignature },
      translucent: true
    });
    popover.onDidDismiss()
      .then(async (modalResponse) => {
        if (!!modalResponse.data) {
        // await this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
        this.setSignatureValue(typeOfSignature, modalResponse.data);
        // await this.createpdf();
        //setTimeout(() => {
        //}, 500)
        }
      });

    return await popover.present();
  }


  async DismissClick() {
    await this.popoverController.dismiss();
  }
  

  getLocationName(componentRequest){
    if(componentRequest.location_id=='') return '';
    let categoryName = '';
    let filtered = this.locations.filter(location => location.id == componentRequest.location_id)[0];
    categoryName = filtered.name;
    return categoryName;
  }

  getCurrentRequest(componentRequest) {
    let requestObj: any = {};
    if(this.currentProtocolId == 1 || (this.currentProtocolId == 2 && this.currentSession.parties.unit_id == '') || (this.currentProtocolId == 3 && this.currentSession.parties.unit_id == '')){
      let categoryName = '';
      switch(componentRequest.category_id){
        case 3:
          categoryName = this.TranslationService.translationsList.offline_tool.main_categories.deficiency;
          break;
        case 4:
          categoryName = this.TranslationService.translationsList.offline_tool.main_categories.open_issue;
          break;
        default:
          break;
      }
        requestObj.mainlabel = categoryName + ': ';        
    } else {
    if (!!this.translations.requests) {
        if (componentRequest.category_id == 2) {
          requestObj.mainlabel = this.translations.requests.category.deficiency + ': ';
        } else if (componentRequest.category_id == 1) {
          requestObj.mainlabel = this.translations.requests.category.normal_wear + ': ';
        } else if (componentRequest.category_id == 3) {
          requestObj.mainlabel = this.translations.requests.category.re_cleaning + ': ';
        } else if (componentRequest.category_id == 4) {
          requestObj.mainlabel = this.translations.requests.category.non_existent + ': ';
        }
    }
  }
    return requestObj;
  }
  
  getCostByMethodName(costPaidBy) {
    let costBy;
    Object.keys(this.costImpacts).map(key => {
      if ((costPaidBy).toString() == key) {
        costBy = this.costImpacts[key];
      }
    });

    return this.TranslationService.translateText(this.TranslationService.translationsList.requests.cost_impact, costBy);
    // return this.translateText(this.translations.requests.cost_impact, costBy);
  }
  getActionName(action) {
    let actionName;
    Object.keys(this.actions).map(key => {
      if ((action).toString() == key) {
        actionName = this.actions[key];
      }
    });

    return this.TranslationService.translateText(this.TranslationService.translationsList.requests.action, actionName);
  }
  async createpdf() {
    this.saveSignatureSubmitData();
    const current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    this.currentSession = submit_data[current_index];
    this.currentProtocolId = this.currentSession.protocol_type.id;
    let contentArray: any[] = [];
    let headerName;
    headerName = this.TranslationService.translateText(this.TranslationService.translationsList.protocol_types_title, this.currentSession.protocol_type.name)
    
    let headerFirstChar = headerName[0];
    let headerAfterChar = headerName.substring(1);
    
    //COLORS
    const white = '#FFFFFF', rahino = '#404B56', lightblack = '#535d66', lavenderBlush = '#F7F0F2', tyrianPurple = '#6B0039';
    const greenYellow = '#B6B46E', whiteGrey = '#F2F3F4', suvaGrey = "#858385", silverGrey = "#404B56", lightred = '#6A0B37';
    const singWidth = [265.5, '-0.4%', 265.5] , miskeyWidth= [178, 178, 173] , misnameWidth = [545], generalNoteWidth = [545],
          signatureBoxHeight = 124.8 , signatureWidth = 224 , signatureHeight = 114;
    const topdataMargin = [1, 1.5, 5, 0] , roomcompMagrin =  [1, 5, 0, 5] , defectMargin = [-1.5, 0, 0, 0];
    const marginBottom17 = 17 , roomdataMargin = [-1.5, -5, 0, 0] , miscnameMargin = [-15, 0, 0, 0] ;
    // fontSize:
    const fontSize11 = 11, fontSize12 = 12;
    const width50 = 50;
    const height50 = 50;
    const width200 = 200 , width170 = 170;
    const height40 = 40;
    const marginTop6 = -6;
    const header = {
      style: 'headerStyle',
      table: {
        widths: [620, '*'],
        body: [
          [
            {
              margin: [25.9, 25, 0, 0],
              text: [
                {
                  style: 'underLineText',
                  text: headerFirstChar
                },
                headerAfterChar
                
              ],
              color: white,
              fillColor: '#660036',
              bold: false,
            },
            {
              margin: [-132.2, 28, 0, 7],
              fillColor: '#660036',
              color: '#660036',
              height: 19,
              width: 72.5,
              image: this.fortimoLogo,
            }
          ]
        ]
      },
      layout: 'noBorders'
    };
    contentArray.push(header);
    let parties: any = {};
    this.residents = await this.storage.get('residents');
    let topLeftHeader, topRightHeader, middleLeftHeader, middleRightHeader, btmLeftHeader, btmRightHeader, lowerMiddleLeftHeader;
    let topLeftSignatureHeader = "", topLeftSignature = this.emptyObjectImg, btmRightSignatureHeader = "", btmRightSignature = this.emptyObjectImg, translationArray;
    let objects = [], topRightSignatureHeader = "", topRightSignature = this.emptyObjectImg, btmLeftSignatureHeader = "", btmLeftSignature = this.emptyObjectImg;
    let selectedQuarter;
    Object.keys(this.currentSession.conclusion.signature).map(key => {
      let currentKeyName = "", currentKeyValue;
      if (key === 'tu_gu') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_tu_gu;
      }
      if (key === 'service_provider') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_service_provider;
      }
      if (key === 'house_owner') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_house_owner;
      }
      if (key === 'incoming') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_resident_incoming;
      }
      if (key === 'outgoing') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_resident_outgoing;
      }
      if (key === 'real_estate_company') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.labels.signature_real_estate_company;
      }
      if (key === 'resident') {
        currentKeyName = this.TranslationService.translationsList.offline_tool.placeholders.residents;
      }
      currentKeyValue = this.currentSession.conclusion.signature[key] != "" ? this.currentSession.conclusion.signature[key] : this.emptyObjectImg;
      if (topLeftSignatureHeader === "") {
        topLeftSignatureHeader = currentKeyName;
        topLeftSignature = currentKeyValue;
      } else if (topRightSignatureHeader === "") {
        topRightSignatureHeader = currentKeyName;
        topRightSignature = currentKeyValue;
      } else if (btmLeftSignatureHeader === "") {
        btmLeftSignatureHeader = currentKeyName;
        btmLeftSignature = currentKeyValue;
      } else if (btmRightSignatureHeader === "") {
        btmRightSignatureHeader = currentKeyName;
        btmRightSignature = currentKeyValue;
      }
    });
    if (this.currentProtocolId == 1 ||  this.currentProtocolId == 2 || this.currentProtocolId == 3) {
      if (this.currentProtocolId == 1 ||  this.currentProtocolId == 2 || (this.currentProtocolId == 3 && (!this.currentSession.parties.resident || this.currentSession.parties.resident == ""))) {
        this.units = await this.storage.get('units'); 
        this.buildings = await this.storage.get('buildings');
  
        let building = this.buildings.filter(building => building.id == this.currentSession.parties.building_id)[0];
        parties['middleLeft'] =   building.street + ' ' + building.house_num;
  
        parties['btmLeft'] = "";
        if(this.currentSession.parties.unit_id != ''){
          parties['btmLeft'] = this.units.filter(unit => unit.id == this.currentSession.parties.unit_id)[0].name ;
        }
        
        parties['topRight'] = this.currentSession.parties.house_owner; 
        // if (this.currentProtocolId == 1) {
        //   let serviceProviderName = this.serviceProviders.find(serviceProvider=> serviceProvider.id == this.currentSession.parties.service_provider);
        //   if (!!serviceProviderName) {
        //     parties['middleRight'] = serviceProviderName.full_name;
        //   }
        // }
        selectedQuarter = this.quartersData.find(item => item.id == this.currentSession.parties.quarter_id);
        if (!!selectedQuarter) {
          parties['topLeft'] = selectedQuarter.name;
        }
        topLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.quarter;
        middleLeftHeader = this.TranslationService.translationsList.offline_tool.labels.building;
        btmLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.unit;
        topRightHeader = this.TranslationService.translationsList.requests.cost_impact.house_owner;
        // middleRightHeader = this.TranslationService.translationsList.offline_tool.placeholders.request.service_provider;
      } else {
        let resident = this.residents.find(item => item.id == this.currentSession.parties.resident);
        if (!!resident) {
          parties['btmLeft'] = resident.full_name;
        }
        selectedQuarter = this.quartersData.find(item => item.id == this.currentSession.parties.quarter_id);
        if (!!selectedQuarter) {
          parties['topLeft'] = selectedQuarter.name;
        }
        this.units = await this.storage.get('units'); 
        this.buildings = await this.storage.get('buildings');
        let building = this.buildings.filter(building => building.id == this.currentSession.parties.building_id)[0];
        parties['middleLeft'] =   building.street + ' ' + building.house_num;
  
        parties['lowerMiddleLeft'] = "";
        if(this.currentSession.parties.unit_id != ''){
          parties['lowerMiddleLeft'] = this.units.filter(unit => unit.id == this.currentSession.parties.unit_id)[0].name ;
        }
        
        parties['topRight'] = this.currentSession.parties.house_owner; 
        
        btmLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.residents;
        topLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.quarter;
        middleLeftHeader = this.TranslationService.translationsList.offline_tool.labels.building;
        lowerMiddleLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.unit;
        topRightHeader = this.TranslationService.translationsList.requests.cost_impact.house_owner;
      }
      if (this.currentSession.parties.unit_id != '') {
        objects = this.currentSession.rooms;
        translationArray = this.TranslationService.translationsList.rooms;
      } else{
        objects = this.currentSession.floors;
        translationArray = this.TranslationService.translationsList.floors;
      }

    } else {
      let matchedMovingOutId;
      if(this.currentProtocolId == 5) {
         matchedMovingOutId = this.residents.find(item => item.id == this.currentSession.parties.moving_out_id);
         if (matchedMovingOutId) {
          parties['topLeft'] = matchedMovingOutId.full_name;
         }
         parties['topRight'] = this.currentSession.parties.house_owner;
         parties['middleRight'] = this.currentSession.parties.real_estate_company;
         topLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.moving_out_resident;
         topRightHeader = this.TranslationService.translationsList.requests.cost_impact.house_owner;
         middleRightHeader = this.TranslationService.translationsList.offline_tool.labels.realstate_company;
      } else {
        let matchedMovingInId = this.residents.find(item => item.id == this.currentSession.parties.moving_in_id);
        if (!!matchedMovingInId) {
          parties['topLeft'] = matchedMovingInId.full_name;
        }
        if (!!this.currentSession.parties.moving_out_id) {
          matchedMovingOutId = this.movingOuts.find(item => item.id == this.currentSession.parties.moving_out_id);
        }
        if (matchedMovingOutId) {
          parties['topRight'] = matchedMovingOutId.full_name;
        }
        parties['middleRight'] = this.currentSession.parties.house_owner;
        parties['btmRight'] = this.currentSession.parties.real_estate_company;
        topLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.moving_in_resident;
        topRightHeader = this.TranslationService.translationsList.offline_tool.placeholders.moving_out_resident;
        middleRightHeader = this.TranslationService.translationsList.requests.cost_impact.house_owner;
        btmRightHeader = this.TranslationService.translationsList.offline_tool.labels.realstate_company;
      }
      parties['btmLeft'] = "";
      parties['middleLeft'] = "";
      this.units = await this.storage.get('units');
      let quarters:any = [];
      this.currentSession.parties.unit_ids.map((unit, index) => {
        let selectedUnit = this.units.find(item => item.id == unit);
        selectedQuarter = this.quartersData.find(item => item.id == selectedUnit.quarter_id);
        if (!!selectedQuarter) {
          quarters.indexOf(selectedQuarter.name) == -1 ? quarters.push(selectedQuarter.name) : '';
        }
        if (!!selectedUnit) {
          parties['btmLeft'] += selectedUnit.name;
        }
        parties['btmLeft'] += this.currentSession.parties.unit_ids.length-1 != index ? ', ' : '';
      });
      parties['middleLeft'] = quarters.join(", ");
      middleLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.quarter;
      btmLeftHeader = this.TranslationService.translationsList.offline_tool.placeholders.unit;
      objects = this.currentSession.rooms;
      translationArray = this.TranslationService.translationsList.rooms;
    }
    const topSection = {
      style: 'section',
      table: {
        widths: ['*', '-0.4%', '*'],
        body: [
          [
            {
              table: {
                body: [
                  [ parties.topLeft!="" && !!parties.topLeft ? {
                    text: [
                      topLeftHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.topLeft  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.middleLeft!="" && !!parties.middleLeft ? {
                    text: [
                      middleLeftHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.middleLeft  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.topleft =="" || !parties.topLeft ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.lowerMiddleLeft!="" && !!parties.lowerMiddleLeft ? {
                    text: [
                    lowerMiddleLeftHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.lowerMiddleLeft  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.middleLeft=="" || !parties.middleLeft ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.btmLeft!="" && !!parties.btmLeft ? {
                    text: [
                      btmLeftHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.btmLeft  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.lowerMiddleLeft=="" || !parties.lowerMiddleLeft ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}]
                ]
              },
              layout: {
                defaultBorder: false,
              },
              fillColor: lavenderBlush,
              marginBottom: marginBottom17,
            },
            {
              text: '',
              color: white,
              fillColor: white
            },
            {
              table: {
                body: [
                  [ parties.topRight!="" && !!parties.topRight? {
                    text: [
                      topRightHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.topRight  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.middleRight!="" && !!parties.middleRight ? {
                    text: [
                      middleRightHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.middleRight  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.topRight=="" || !parties.topRight ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.btmRight!="" && !!parties.btmRight ? {
                    text: [
                      btmRightHeader + ' ',//'Ausz. Bewohner '
                      {
                        text: parties.btmRight  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.middleRight=="" || !parties.middleRight ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                  [ parties.lowerMiddleLeft!="" && !!parties.lowerMiddleLeft ? {
                    text: [
                       ' ',
                      {
                        text: ''  + '\n',
                        color: '#3D3F45',
                        fillColor: lavenderBlush,
                        bold: false,
                        fontSize: fontSize11,
                        italics: true,
                      }],
                    color: tyrianPurple,
                    fillColor: lavenderBlush,
                    margin: [-1, parties.btmRight=="" || !parties.btmRight ? -3 : 1.5, 5, 0],
                    bold: true,
                    fontSize: fontSize11
                  } : {}],
                ]
              },
              layout: {
                defaultBorder: false,
              },
              fillColor: lavenderBlush,
              marginBottom: marginBottom17,
            },
          ],
        ],
      },
      layout: 'noBorders',
      marginBottom: 2,
    };
    contentArray.push(topSection);
    objects.forEach(currentObject => {
      let okayComponents = ' ';
      let okayComponentsArray: any = [];
      let currentHeaderName;
      let currentComp;
      currentHeaderName = currentObject.id >= 9999 ? currentObject.name : this.TranslationService.translateText(translationArray, currentObject.name);//this.translateText(this.translations.rooms, room.name);
      if (this.currentProtocolId == 4 || this.currentProtocolId == 5 || (this.currentProtocolId == 2 && this.currentSession.parties.unit_id != '') || (this.currentProtocolId == 3 && this.currentSession.parties.unit_id != '')) {
        currentComp = currentObject.components;
      } else {
        currentComp = currentObject.request;
      }
      if (!!currentComp && currentObject.complete == true) {
        //New Object
        const newObject = {
          unbreakable: true,
          style: 'componentStyle',
          table: {
            // widths: ['*', '*', '*', '*'],
            widths: [136.25, 135.25, 123, 126.3],
            body: [
              [
                {
                  text: [currentHeaderName],
                  color: rahino,
                  bold: true,
                  fontSize: fontSize11,
                  colSpan: 4,
                  margin: [6, 5, 0, 2],
                },
              ]
            ]
          },
          layout: 'noBorders'
        };
        contentArray.push(newObject);
        let nonOkayComponents: any = [];
        let components;
        let currentComponent;
        if (this.currentProtocolId == 4 || this.currentProtocolId == 5 || (this.currentProtocolId == 2 && this.currentSession.parties.unit_id != '') || (this.currentProtocolId == 3 && this.currentSession.parties.unit_id != '')) {
          currentComp.forEach(component => {
            currentComponent = component.id >= 9999 ? component.name : this.TranslationService.translateText(this.TranslationService.translationsList.components, component.name);//this.translateText(this.translations.components , component.name);
            if (!!component.request) {
              if (component.category_id != 0) {
                component.request['currentComponent'] = currentComponent;
                nonOkayComponents.push(component);
              }
              else {
                okayComponentsArray.push(currentComponent);
              }
            }
          });
          okayComponents = okayComponentsArray.join(", ");
          if (nonOkayComponents.length % 2 != 0) {
            nonOkayComponents.push({
              id: '',
              name: '',
              unique_number: '',
              complete: true,
              category_id: '',
              request: {
                title: "",
                description: "",
                inspection_images: [],
                currentComponent: "",
                cost_by: {method: "", value: 0}
              }
            });
          }
          // Non okay components - rooms
          for (var i = 0; i < nonOkayComponents.length; i = i + 2) {
            let pageBreak = {
              unbreakable: true,
              stack: []
            }
            // left section update data           
            let leftSection = [];
            // 1. image
            let leftImage = this.getComponentImage(nonOkayComponents[i].request, height50, width50, roomcompMagrin);
            // 2. Title
            let leftTitle = this.getRoomTitle(nonOkayComponents, i, lightred);
            // 3. Keyword
            let keywordTitle = nonOkayComponents[i].category_id == '' ? '' : this.TranslationService.translationsList.offline_tool.placeholders.request.title + ': ';
            let keywordValueLeft = nonOkayComponents[i].category_id == '' ? '' : nonOkayComponents[i].request.title + '\n';
            let keywordLeftRow = this.getComponentRowText(nonOkayComponents[i].request, keywordTitle, keywordValueLeft, lightblack, lavenderBlush, suvaGrey);
            //4. costby
            let costByTitle = !!nonOkayComponents[i].request.cost_by ? (!!this.getCostByMethodName(nonOkayComponents[i].request.cost_by.method) ? this.TranslationService.translationsList.offline_tool.labels.cost_by + ': ' : '' ) : '';//'Zu Lasten von: 
            let costByValueLeft = !!nonOkayComponents[i].request.cost_by  ? (!!this.getCostByMethodName(nonOkayComponents[i].request.cost_by.method) ? this.getCostByMethodName(nonOkayComponents[i].request.cost_by.method) + this.getCostByValueString(nonOkayComponents[i].request.cost_by.value) : '') : '' + '\n';
            let costByLeftRow = this.getComponentRowText(nonOkayComponents[i].request, costByTitle, costByValueLeft, lightblack, lavenderBlush, suvaGrey);
            //5. action
            let actionTitle = !!nonOkayComponents[i].request.action ? this.TranslationService.translationsList.requests.action.label + ': ' : '';//'Qualifikation:
            let actionValueLeft = !!nonOkayComponents[i].request.action  ? this.getActionName(nonOkayComponents[i].request.action) : '' + '\n';
            let actionLeftRow = this.getComponentRowText(nonOkayComponents[i].request, actionTitle, actionValueLeft, lightblack, lavenderBlush, suvaGrey);

            leftSection.push(leftImage);
            leftSection.push(leftTitle);
            leftSection.push(keywordLeftRow);
            leftSection.push(costByLeftRow);
            leftSection.push(actionLeftRow);

            // right section update data
            let rightSection = [];
            // 1. image
            let rightImage = this.getComponentImage(nonOkayComponents[i+1].request, height50, width50, roomcompMagrin);
            // 2. Title
            let rightTitle = this.getRoomTitle(nonOkayComponents, i+1, lightred);
            // 3. Keyword
            let keywordTitleRight = nonOkayComponents[i+1].category_id == '' ? '' : this.TranslationService.translationsList.offline_tool.placeholders.request.title + ': ';
            let keywordValueRight = nonOkayComponents[i + 1].category_id == '' ? '' : nonOkayComponents[i + 1].request.title + '\n';
            let keywordRightRow = this.getComponentRowText(nonOkayComponents[i+1].request, keywordTitleRight, keywordValueRight, lightblack, lavenderBlush, suvaGrey);
            //4. costby
            let costByTitleRight = !!nonOkayComponents[i+1].request.cost_by ? (!!this.getCostByMethodName(nonOkayComponents[i+1].request.cost_by.method) ? this.TranslationService.translationsList.offline_tool.labels.cost_by + ': ' : '' ) : '';//'Zu Lasten von: 
            let costByValueRight = !!nonOkayComponents[i+1].request.cost_by  ? (!!this.getCostByMethodName(nonOkayComponents[i+1].request.cost_by.method) ? this.getCostByMethodName(nonOkayComponents[i+1].request.cost_by.method) + this.getCostByValueString(nonOkayComponents[i+1].request.cost_by.value) : '') : '' + '\n';
            let costByRightRow = this.getComponentRowText(nonOkayComponents[i+1].request, costByTitleRight, costByValueRight, lightblack, lavenderBlush, suvaGrey);
            //5. action
            let actionTitleRight = !!nonOkayComponents[i+1].request.action ? this.TranslationService.translationsList.requests.action.label + ': ' : '';//'Qualifikation:
            let actionValueRight = !!nonOkayComponents[i+1].request.action  ? this.getActionName(nonOkayComponents[i+1].request.action) : '' + '\n';
            let actionRightRow = this.getComponentRowText(nonOkayComponents[i+1].request, actionTitleRight, actionValueRight, lightblack, lavenderBlush, suvaGrey);

            rightSection.push(rightImage);
            rightSection.push(rightTitle);
            rightSection.push(keywordRightRow);
            rightSection.push(costByRightRow);
            rightSection.push(actionRightRow);

            components = {
              style: 'roomStyle',
              table: {
                widths:[272.5,248.3],
                body: [
                  [
                    {
                      style: 'roomStyle',
                      table: {
                        body: leftSection
                      },
                      layout: {
                        defaultBorder: false,
                        margin: [0, 0, 10, 0],
                      }
                    },
                    {
                      style: 'roomStyle',
                      table: {
                        body: rightSection
                      },
                      layout: {
                        defaultBorder: false,
                      }
                    },
                  ],
                ]
              },
              layout: {
                defaultBorder: false,
              }
            };
            // Below code for set empty box at end
            components.table.body[0][0].table.body = this.processEmptyRows(components.table.body[0][0]);//left section
            components.table.body[0][1].table.body = this.processEmptyRows(components.table.body[0][1]);// right section

            let afterDeleteEmptyRows = this.deleteEmptyRowsFromBothSection(components.table.body[0][0], components.table.body[0][1]);
            components.table.body[0][0].table.body = afterDeleteEmptyRows[0];
            components.table.body[0][1].table.body = afterDeleteEmptyRows[1];
            
            pageBreak.stack.push(components);
            contentArray.push(pageBreak);
          }

          if(okayComponents == ""){
            this.marginBottomRow(contentArray[contentArray.length -1].stack[0].table.body[0][0].table.body,contentArray[contentArray.length -1].stack[0].table.body[0][1].table.body)
          }
        
          let okayComponent = {
            style: 'abgenommen',
            widths:[misnameWidth],
            table: {
              widths: [545],
              body: [
                [
                  {
                    text: [
                      this.TranslationService.translationsList.offline_tool.labels.pdf.okay_component + ': ', //'Abgenommen:',
                      {
                        text: okayComponents,
                        color: silverGrey,
                        bold: false,
                        fillColor: lavenderBlush,
                      }],
                    color: '#969731',
                    bold: false,
                    margin: [6, 20, 5, 8],
                  },
                ]
              ]
            },
            layout: 'noBorders'
          }
          if (okayComponents != '') {
            //okay components
            contentArray.push(okayComponent);
          }
        } else {
          currentComp.forEach(component => {
            nonOkayComponents.push(component);
          });
          if (nonOkayComponents.length % 2 != 0) {
            nonOkayComponents.push({
              location_id: "",
              category_id: "",
              title: "",
              description: "",
              cost_by: {method: "", value: 0},
              service_provider: "",
              action:null,
              plan_id: "",
              complete: true,
              inspection_images: [],
            });
          }
          // Non okay components
      for (var i = 0; i < nonOkayComponents.length; i = i + 2) {
            let pageBreak = {
              unbreakable: true,
              stack: []
            }
            // left section update data
            let leftSection = [];
            // 1. image
            let leftImage = this.getComponentImage(nonOkayComponents[i], height50, width50, roomcompMagrin);
            // 2. Title
            let leftTitle = this.getFloorTitle(nonOkayComponents, i, lightred);
            // 3. Keyword
            let keywordTitle = nonOkayComponents[i].category_id == '' ? '' : this.TranslationService.translationsList.offline_tool.placeholders.request.title + ': ';
            let keywordValueLeft = nonOkayComponents[i].category_id == '' ? '' : nonOkayComponents[i].title + '\n';
            let keywordLeftRow = this.getComponentRowText(nonOkayComponents[i], keywordTitle, keywordValueLeft, lightblack, lavenderBlush, suvaGrey);
            //4. costby
            let costByTitle = !!nonOkayComponents[i].cost_by ? (!!this.getCostByMethodName(nonOkayComponents[i].cost_by.method) ? this.TranslationService.translationsList.offline_tool.labels.cost_by + ': ' : '' ) : '';//'Zu Lasten von: 
            let costByValueLeft = !!nonOkayComponents[i].cost_by  ? (!!this.getCostByMethodName(nonOkayComponents[i].cost_by.method) ? this.getCostByMethodName(nonOkayComponents[i].cost_by.method) + this.getCostByValueString(nonOkayComponents[i].cost_by.value) : '') : '' + '\n';
            let costByLeftRow = this.getComponentRowText(nonOkayComponents[i], costByTitle, costByValueLeft, lightblack, lavenderBlush, suvaGrey);
            //5. action
            let actionTitle = !!nonOkayComponents[i].action ? this.TranslationService.translationsList.requests.action.label + ': ' : '';//'Qualifikation:
            let actionValueLeft = !!nonOkayComponents[i].action  ? this.getActionName(nonOkayComponents[i].action) : '';
            let actionLeftRow = this.getComponentRowText(nonOkayComponents[i], actionTitle, actionValueLeft, lightblack, lavenderBlush, suvaGrey);
            //6. due date
            let dueDateTitleLeft = !!nonOkayComponents[i].due_date ? this.TranslationService.translationsList.offline_tool.labels.due_date + ': ' : '';//'Zu Lasten von: '
            let dueDateValueLeft = !!nonOkayComponents[i].due_date ? nonOkayComponents[i].due_date : '';
            let dueDateLeftRow = this.getComponentRowText(nonOkayComponents[i], dueDateTitleLeft, dueDateValueLeft, lightblack, lavenderBlush, suvaGrey);
            // filling left section            
            leftSection.push(leftImage);
            leftSection.push(leftTitle);
            leftSection.push(keywordLeftRow);
            leftSection.push(costByLeftRow);
            leftSection.push(actionLeftRow);
            leftSection.push(dueDateLeftRow);
            // right section update data
            let rightSection = [];

            // 1. image
            let rightImage = this.getComponentImage(nonOkayComponents[i+1], height50, width50, roomcompMagrin);
            // 2. title
            let rightTitle = this.getFloorTitle(nonOkayComponents, i+1, lightred);
            // 3. Keyword
            let keywordTitleRight = nonOkayComponents[i+1].category_id == '' ? '' : this.TranslationService.translationsList.offline_tool.placeholders.request.title + ': ';
            let keywordValueRight = nonOkayComponents[i + 1].category_id == '' ? '' : nonOkayComponents[i+1].title + '\n';
            let keywordRightRow = this.getComponentRowText(nonOkayComponents[i+1], keywordTitleRight, keywordValueRight, lightblack, lavenderBlush, suvaGrey);           
            //4. costby
            let costByTitleRight = !!nonOkayComponents[i+1].cost_by ? (!!this.getCostByMethodName(nonOkayComponents[i+1].cost_by.method) ? this.TranslationService.translationsList.offline_tool.labels.cost_by + ': ' : '' ) : '';//'Zu Lasten von: 
            let costByValueRight = !!nonOkayComponents[i+1].cost_by  ? (!!this.getCostByMethodName(nonOkayComponents[i+1].cost_by.method) ? this.getCostByMethodName(nonOkayComponents[i+1].cost_by.method) + this.getCostByValueString(nonOkayComponents[i+1].cost_by.value) : '') : '' + '\n';
            let costByRightRow = this.getComponentRowText(nonOkayComponents[i+1], costByTitleRight, costByValueRight, lightblack, lavenderBlush, suvaGrey);
           //5. action
            let actionTitleRight = !!nonOkayComponents[i+1].action ? this.TranslationService.translationsList.requests.action.label + ': ' : '';//'Qualifikation:
            let actionValueRight = !!nonOkayComponents[i+1].action  ? this.getActionName(nonOkayComponents[i+1].action) : '' ;
            let actionRightRow = this.getComponentRowText(nonOkayComponents[i+1], actionTitleRight, actionValueRight, lightblack, lavenderBlush, suvaGrey);
           //6. due date
            let dueDateTitleRight = !!nonOkayComponents[i+1].due_date ? this.TranslationService.translationsList.offline_tool.labels.due_date + ': ' : '';//'Zu Lasten von: '
            let dueDateValueRight = !!nonOkayComponents[i+1].due_date ? nonOkayComponents[i+1].due_date : '' ;
            let dueDateRightRow = this.getComponentRowText(nonOkayComponents[i+1], dueDateTitleRight, dueDateValueRight, lightblack, lavenderBlush, suvaGrey);
             // filling left section  
            rightSection.push(rightImage);
            rightSection.push(rightTitle);
            rightSection.push(keywordRightRow);
            rightSection.push(costByRightRow);
            rightSection.push(actionRightRow);
            rightSection.push(dueDateRightRow);

            components = {
              style: 'roomStyle',
              table: {
                widths: [272.5,248.3],
                body: [
                  [
                    {
                      style: 'roomStyle',
                      table: {
                        body: leftSection
                      },
                      layout: {
                        defaultBorder: false,
                        margin: [0, 0, 10, 0],

                      }
                    },
                    {
                      style: 'roomStyle',
                      table: {
                        body: rightSection
                      },
                      layout: {
                        defaultBorder: false,
                      }
                    },
                  ],
                ]
              },
              layout: {
                defaultBorder: false,
              }
            };
            // Below code for set empty box at end
            components.table.body[0][0].table.body = this.processEmptyRows(components.table.body[0][0]);// left section
            components.table.body[0][1].table.body = this.processEmptyRows(components.table.body[0][1]);// right section
            
            let afterDeleteEmptyRows = this.deleteEmptyRowsFromBothSection(components.table.body[0][0], components.table.body[0][1]);
            components.table.body[0][0].table.body = afterDeleteEmptyRows[0];
            components.table.body[0][1].table.body = afterDeleteEmptyRows[1];

            let marginBottomRow = this.marginBottomRow(afterDeleteEmptyRows[0],afterDeleteEmptyRows[1]);
            pageBreak.stack.push(components);
            contentArray.push(pageBreak);
          }
          
        }
      }
    });
    if (this.currentProtocolId == 4 || this.currentProtocolId == 5) {
      const SchlüsselObj = {
        unbreakable: true,
        style: 'keyStyle',
        table: {
          widths: misnameWidth,
          body: [
            [
              {
                margin: [6, 6, 0, 10],
                width: width200,
                height: 250,
                text: [this.TranslationService.translationsList.offline_tool.labels.pdf.key_list], //['Schlüssel'],
                color: rahino,
                bold: true,
                fontSize: fontSize11,
  
              },
            ]
          ]
        },
        layout: 'noBorders',
      };
      const schlüsselTable = {
        unbreakable: true,
        margin: miscnameMargin,
        style: 'roomStyle',
        table: {
          widths: miskeyWidth,
          body: []
        },
        layout: 'noBorders',
  
      };
      this.filteredMiscKeys = this.currentSession.miscellaneous.key.filter(miscKey => {
        return miscKey.key_value > 0;
      })
      for (var j = 0; j < this.filteredMiscKeys.length; j = j + 3) {
        let misKey: any = [];
        let keyValue1;
        let keyValue2;
        let keyValue3;
        const marginLeft6 = 6;
        const marginLeft10 = 10;
        if (!!this.filteredMiscKeys[j]) {
          keyValue1 = !!this.filteredMiscKeys[j].key_value ? this.filteredMiscKeys[j].key_value : '';
          if (keyValue1 != '') {
            misKey.push({
              text: [this.TranslationService.translateText(this.TranslationService.translationsList.misc_key_lists, this.filteredMiscKeys[j].name) + ': ',
              {
                text: keyValue1,
                color: suvaGrey,
              }],
              alignment: 'left',
              color: silverGrey,
              marginLeft: marginLeft6,
              marginTop: marginTop6,
              marginBottom: 4,
            });
          }
        }
        if (!!this.filteredMiscKeys[j + 1]) {
          keyValue2 = !!this.filteredMiscKeys[j + 1].key_value ? this.filteredMiscKeys[j + 1].key_value : '';
          if (keyValue2 != '') {
            misKey.push({
              text: [this.TranslationService.translateText(this.TranslationService.translationsList.misc_key_lists, this.filteredMiscKeys[j + 1].name) + ': ',
              {
                text: keyValue2,
                color: suvaGrey,
              }],
              color: silverGrey,
              alignment: 'left',
              marginLeft: marginLeft6,
              marginBottom: 2.5,
              marginTop: marginTop6,
            });
          }
        } else {
          misKey.push({
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft10,
            marginTop: marginTop6,
  
          });
        }
        if (!!this.filteredMiscKeys[j + 2]) {
          keyValue3 = !!this.filteredMiscKeys[j + 2].key_value ? this.filteredMiscKeys[j + 2].key_value : '';
          if (keyValue3 != '') {
            misKey.push({
              text: [this.TranslationService.translateText(this.translations.misc_key_lists, this.filteredMiscKeys[j + 2].name) + ': ',
              {
                text: keyValue3,
                color: suvaGrey,
              }],
              alignment: 'left',
              color: silverGrey,
              marginLeft: marginLeft10,
              marginTop: marginTop6,
  
            });
          }
        } else {
          misKey.push({
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft10,
            marginTop: marginTop6,
          });
        }
        for (var k = misKey.length; k < 3; k++) {
          misKey[k] = {
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft10,
            marginTop: marginTop6,
  
          }
        }
        schlüsselTable.table.body.push(misKey);
      }
      const schlüStack = {
        unbreakable: true,
        stack: [SchlüsselObj, this.filteredMiscKeys.length > 0 ? schlüsselTable : []]
      }
      // // miscellanous key
      if(this.filteredMiscKeys.length > 0){
      contentArray.push(schlüStack);
      }
      const allgemeinesObj = {
        unbreakable: true,
        style: 'keyStyle1',
        margin: [-15,this.filteredMiscKeys.length > 0 ? 4: 15.3, -15, 0],
        table: {
          widths: misnameWidth,
          body: [
            [
              {
                margin: [6, 5, 0, 10],
                width: width200,
                text: [this.TranslationService.translationsList.offline_tool.labels.pdf.general],//['Allgemeines'], 
                color: lightblack,
                bold: true,
                fontSize: fontSize11,
              },
            ]
          ]
        },
        layout: 'noBorders',
      };

      const allgemeinesTable = {
        style: 'roomStyle',
        margin: miscnameMargin,
        table: {
          widths: miskeyWidth,
          body: []
        },
        layout: 'noBorders',
      };
      const marginLeft6 = 6;
      const marginBtm4 = 4;
      let filteredGeneralKeys = this.currentSession.miscellaneous.general.filter(genKey => {
        return genKey.key_value > 0;
      })
      filteredGeneralKeys.push({name:this.TranslationService.translationsList.misc_generals.information_brochure, key_value: this.currentSession.miscellaneous.information_brochure === true ? this.TranslationService.translationsList.offline_tool.labels.yes : this.TranslationService.translationsList.offline_tool.labels.no});
      filteredGeneralKeys.push({name:this.TranslationService.translationsList.offline_tool.labels.handed_over_cleaned, key_value: this.currentSession.miscellaneous.handed_over_cleaned === true ? this.TranslationService.translationsList.offline_tool.labels.yes : this.TranslationService.translationsList.offline_tool.labels.no});
      for (var j = 0; j < filteredGeneralKeys.length; j = j + 3) {
        let misKey: any = [];
        let keyValue1;
        let keyValue2;
        let keyValue3;
        if (!!filteredGeneralKeys[j]) {
          keyValue1 = !!filteredGeneralKeys[j].key_value ? filteredGeneralKeys[j].key_value : '';
          if (keyValue1 != '') {
            misKey.push({
              text: [(!!this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j].name) ? this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j].name) : filteredGeneralKeys[j].name )+ ': ',
              {
                text: keyValue1,
                color: suvaGrey,
              }],
              alignment: 'left',
              color: silverGrey,
              marginLeft: marginLeft6,
              marginTop: marginTop6,
              marginBottom: marginBtm4,
            });
          }
        }
        if (!!filteredGeneralKeys[j + 1]) {
          keyValue2 = !!filteredGeneralKeys[j + 1].key_value ? filteredGeneralKeys[j + 1].key_value : '';
          if (keyValue2 != '') {
            misKey.push({
              text: [(!!this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j + 1].name) ? this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j + 1].name) : filteredGeneralKeys[j + 1].name )+ ': ',
              {
                text: keyValue2,
                color: suvaGrey,
              }],
              alignment: 'left',
              color: silverGrey,
              marginLeft: marginLeft6,
              marginBottom: 2.5,
              marginTop: marginTop6,
            });
          }
        } else {
          misKey.push({
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft6,
            marginTop: marginTop6,
          });
        }
        if (!!filteredGeneralKeys[j + 2]) {
          keyValue3 = !!filteredGeneralKeys[j + 2].key_value ? filteredGeneralKeys[j + 2].key_value : '';
          if (keyValue3 != '') {
            misKey.push({
              text: [(!!this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j + 2].name) ? this.TranslationService.translateText(this.TranslationService.translationsList.misc_generals, filteredGeneralKeys[j + 2].name) : filteredGeneralKeys[j + 2].name )+ ': ',
              {
                text: keyValue3,
                color: suvaGrey,
              }],
              alignment: 'left',
              color: silverGrey,
              marginLeft: marginLeft6,
              marginTop: marginTop6,
            });
          }
        } else {
          misKey.push({
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft6,
            marginTop: marginTop6,
          });
        }
        for (var k = misKey.length; k < 3; k++) {
          misKey[k] = {
            text: '',
            color: silverGrey,
            alignment: 'left',
            marginLeft: marginLeft6,
            marginTop: marginTop6,
          }
        }
        allgemeinesTable.table.body.push(misKey);
      }
      const allgeStack = {
        unbreakable: true,
        stack: [allgemeinesObj, allgemeinesTable]
      }
      // generic key
      if(!!filteredGeneralKeys){
      contentArray.push(allgeStack);
      }

    }
    const generalNoteObj = {
      unbreakable: true,
      style: 'keyStyleNote',
      margin: [-15,!!this.currentSession.miscellaneous.general && this.currentSession.miscellaneous.general.length > 0 ? 4 : 15.3, -15, 0],
      table: {
        widths: misnameWidth,
        body: [
          [
            {
              margin: [6, 6, 0, 10],
              width: width200,
              height: 250,
              text: [this.TranslationService.translationsList.offline_tool.labels.notes], //['general notes'],
              color: rahino,
              bold: true,
              fontSize: fontSize11,

            },
          ]
        ]
      },
      layout: 'noBorders',
    };
    const generalNoteTable = {
      unbreakable: true,
      margin: miscnameMargin,
      style: 'roomStyle',
      table: {
        widths: misnameWidth,
        body: []
      },
      layout: 'noBorders',

    };
    let generalNotes: any = [];
    let genNote;
    const marginLeft6 = 6;
    const marginLeft10 = 10;
    if (!!this.currentSession.miscellaneous.general_note) {
      genNote = !!this.currentSession.miscellaneous.general_note ? this.currentSession.miscellaneous.general_note : '';
      if (genNote != '') {
        generalNotes.push({
          text: ['',
          {
            text: genNote,
            color: suvaGrey,
          }],
          alignment: 'left',
          color: silverGrey,
          marginLeft: marginLeft6,
          marginTop: marginTop6,
          marginBottom: 4,
        });
      }
    }
    generalNoteTable.table.body.push(generalNotes);
    const generalNoteStack = {
      unbreakable: true,
      stack: [generalNoteObj, generalNoteTable]
    }
    // miscellanous key
    if(!!this.currentSession.miscellaneous.general_note){
    contentArray.push(generalNoteStack);
    }
    //city and date
    const cityDate = {
      color: silverGrey,
      margin: [-14, 21, 0, -7],
      fontSize: fontSize11,
      text: this.currentSession.conclusion.city + ',' + ' ' + this.conclusionDate,
      // text: this.city + ',' + ' ' + this.datePipe.transform(this.conclusionDate, 'dd.MM.yyyy'),
    };
    contentArray.push(cityDate);
    const topSectionSignature = {
      unbreakable: true,
      style: 'section',
      table: {
        widths: singWidth,
        body: [
          [],
          []
        ],
      },
      layout: 'noBorders'
    };
    topSectionSignature.table.body[0].push({
      margin: [6, 5, 0, 3],
      text: topLeftSignatureHeader,//'Unterschrift einziehender Bewohner',
      color: tyrianPurple,
      bold: true
    });
    topSectionSignature.table.body[0].push({
      text: '',
      color: white,
      fillColor: white
    });
    topSectionSignature.table.body[1].push({
      margin: [50, 0, 0, 2],
      width: width170,
      height: signatureBoxHeight,
      image: topLeftSignature,
      color: tyrianPurple,
    });
    topSectionSignature.table.body[1].push({
      text: '',
      color: white,
      fillColor: white
    });
    if (topRightSignatureHeader != "") {
      topSectionSignature.table.body[0].push({
        margin: [2, 5, 0, 3],
        text: topRightSignatureHeader,//'Unterschrift ausziehender Bewohner',
        color: tyrianPurple,
        bold: true
      });
      topSectionSignature.table.body[1].push({
        margin: [50, 0, 0, 2],
        width: width170,
        height: signatureBoxHeight,
        image: topRightSignature,
        color: tyrianPurple,
      });
    }

    // first row signature
    contentArray.push(topSectionSignature);
    const signaturerow2 = {
      unbreakable: true,
      style: 'signatureSection1',
      table: {
        widths: singWidth,
        body: [
          [],
          []
        ],
      },
      layout: 'noBorders',
      margin: [-15, 6, 0, 0]

    };
    if (btmLeftSignatureHeader != "") {
      signaturerow2.table.body[0].push({
        margin: [6, 5, 0, 3],
        text: btmLeftSignatureHeader,
        color: tyrianPurple,
        bold: true

      });
      signaturerow2.table.body[0].push({
        text: '',
        color: white,
        fillColor: white
      });
      signaturerow2.table.body[1].push({
        margin: [50, 0, 0, 2],
        width: width170,
        height: signatureBoxHeight,
        image: btmLeftSignature,
        color: tyrianPurple,
      });
      signaturerow2.table.body[1].push({
        text: '',
        color: white,
        fillColor: white
      });
    }
    if (btmRightSignatureHeader != "") {
      signaturerow2.table.body[0].push({
        margin: [btmLeftSignatureHeader != "" ? 2 : 6, 5, 0, 3],
        text: btmRightSignatureHeader, //'Unterschrift Eigentümer',
        color: tyrianPurple,
        bold: true,
      });
      signaturerow2.table.body[1].push({
        margin: [50, 0, 0, 2],
        width: width170,
        height: signatureBoxHeight,
        image: btmRightSignature,
        color: tyrianPurple,
      });
    }
    // second row signature
    contentArray.push(signaturerow2);
    var documentDefinition = {
      content: contentArray,
      styles:
      {
        underLineText: {
          decoration: 'underline'
        },
        section: {
          fontSize: fontSize12,
          fillColor: lavenderBlush,
          margin: [-15, 14, -15, 0]
        },
        signatureSection: {
          fontSize: fontSize12,
          fillColor: lavenderBlush,
          margin: [-15, 8, -15, 0],
        },
        signatureSection1: {
          fontSize: fontSize12,
          fillColor: lavenderBlush,
          margin: [-15, 7, -15, 0],
        },
        componentStyle: {
          fillColor: whiteGrey,
          fontSize: fontSize12,
          margin: [-15, 8.5, -15, 0]
        },
        keyStyle: {
          fillColor: whiteGrey,
          fontSize: fontSize11,
          margin: [-15, 15.3, -15, 0]
        },
        keyStyleNote: {
          fillColor: whiteGrey,
          fontSize: fontSize11,
        },
        keyStyle1: {
          fillColor: whiteGrey,
          fontSize: fontSize12
        },
        roomStyle: {
          margin: [-10, -3, -15, -2.5],
          fillColor: whiteGrey,
          fontSize: 10.5,
        },
        abgenommen: {
          margin: [-15, -15, -15, -5],
          fillColor: whiteGrey,
          fontSize: 11.1,
        },
        signatureStyle: {
          fillColor: lavenderBlush,
          margin: [-15, 10, -10, 0]
        },
        headerStyle: {
          fontSize: 23,
          margin: [-40, -40, 0, 0]
        },
      },
      defaultStyle: {
        alignment: 'left',
        font: 'Roboto',
      }
    };

    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Bold.ttf',
        italics: 'Roboto-Light.ttf',
        bolditalics: 'Roboto-Bold.ttf'
      },
      RadikalW03: {
        normal: 'RadikalW03-Regular.ttf',
        bold: 'RadikalW03-Bold.ttf',
        italics: 'RadikalW03-Regular.ttf',
        bolditalics: 'RadikalW03-Bold.ttf'
      }
    };
    this.pdfObj = pdfMake.createPdf(documentDefinition);
  }

  savePdf() {
    this.pdfObj.getDataUrl(async outDoc => {
      let submitData = await this.storage.get('submit_data');
      let current_index = await this.storage.get('current_index');
      submitData[current_index].conclusion.PDF = outDoc;
      await this.storage.set('submit_data', submitData);
     /* setTimeout(() => {
        this.service.hideLoader();
      }, 200);*/
    });
  }
  async openModal() {
    this.pdfPreview = true;
    this.pdfPreviewClicked = true;
    await this.createpdf();
    this.pdfObj.getDataUrl(async outDoc => {
      const modal = await this.modalController.create({
        component: PdfPreviewPage,
        componentProps: { pdf: outDoc}
      });
      modal.onDidDismiss().then((detail) => {
          this.pdfPreview = false;
          this.pdfPreviewClicked = false;
      });
      await modal.present();
    });
  }
  getCostByValueString(value) {
    if (!!value) {
      return ', ' + value + '%';
    }
    return '';
  }

  async goToHome() {
    const isSaved = await this.saveSignatureSubmitData();
    await this.createpdf();
    this.submitData = await this.storage.get('submit_data');
    this.currentIndex = await this.storage.get('current_index');
    this.submitData[this.currentIndex].conclusion.city = this.city;
    let isEmpty = false;
    if (this.currentSession.conclusion.signature.hasOwnProperty('incoming') && this.incomingResSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('outgoing') && this.outgoingResSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('tu_gu') && this.tuCuSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('service_provider') && this.serviceProviderSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('real_estate_company') && this.RSCSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('house_owner') && this.houseOwnerSign === '') {
      isEmpty = true;
    }
    if (this.currentSession.conclusion.signature.hasOwnProperty('resident') && this.residentSign === '') {
      isEmpty = true;
    }

    if (isEmpty) {
      this.submitData[this.currentIndex].card.completed = false;
      await this.storage.set('submit_data', this.submitData);
      this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_all_required_fields);
    } else {
        const config = {
            message: this.TranslationService.translationsList.offline_tool.messages.are_you_sure_to_conclude_submission,
            showYesButton: true,
            showNoButton: true,
            customClass: 'variation3'
        };
        this.service.presentConfirmPopup(config, async () => {
          this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
            this.submitData[this.currentIndex].card.completed = true;
            await this.storage.set('submit_data', this.submitData);
            this.savePdf();
            this.router.navigate(['/home']);
        }, async (submitData) => {
          await this.storage.set('submit_data', this.submitData);
            this.savePdf();
        });
    }
  }
  async SetDate() {
    var parsedDate = Date.parse(this.conclusionDate);
    if (!isNaN(parsedDate)) {
      let submitData = await this.storage.get('submit_data');
      let currentSessionId = await this.storage.get('current_index');
      submitData[currentSessionId].conclusion.date = this.conclusionDate;
      this.conclusionDate = submitData[currentSessionId].conclusion.date;
      await this.storage.set('submit_data', submitData);
    }
    await this.createpdf();
  }

  goToMisc(){
    this.router.navigate(['/miscellaneous']);
  }

  async goToConclutionCity(){
    await this.storage.set('cityInfo',this.city);
      this.router.navigate(['/conclusion-inner']);
     }

}

