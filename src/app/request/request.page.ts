import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController, IonContent, DomController, ModalController, IonSearchbar } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import 'hammerjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { TranslationService } from '../api/translation.service';
import { ImagePopupPage } from '../image-popup/image-popup.page';
import { ObservableService } from '../api/observable.service';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';


@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  @ViewChild(IonContent, { 'static': false }) content: IonContent;
  activeCategoryID: any = 0;
  isRemainNextComponent: any = true;
  isNextComponent:boolean = false;
  costby: any;
  image: any = ''
  all_components: any;
  goToNextRoom: any = true;
  currentComponentIndex: any;
  currentComponentName: any;
  roomName: any;
  title:any ='';
  description:any ='';
  service_provider: any;  
  costbyprotocol: any;
  actionprotocol: any;
  sharedValue: any;
  selectedId: number;
  requestInfo: any;
  room_components: any = [];
  rooms: any = [];
  currentProtocolId: any;
  currentProtocolName: any;
  actions: any = [];
  costImpacts: any = [];
  service_providers: any = [];
  request_categories: any = [];
  request_categories_p2: any = [];
  current_index: any;
  currentRoomLength: any;
  currentRoomId: any;
  currentRoomName: any;
  request_data: any = [];
  isNextRoomBtn: any = true;
  isLastComponent:boolean = false;
  locations:any = [];
  currentLocation: any;
  due_date: any = '';
  inspection_images:any = [];
  maxDateYear: any;
  partiesInfo: any;
  currentSelectedRequestId:any;
  headerbackTitle:string;
  headerTitle:string;
  navigationExtras:NavigationExtras;
  hasPlan:boolean = false;
  requiredTitleLabel:boolean = false;
  requiredLocationLabel:boolean = false;
  requestLoaded:boolean = false;

  @ViewChild('datePicker', { 'static': false }) datePicker;

  constructor(
    private storage: Storage,
    public loadingController: LoadingController,
    private router: Router,
    private camera: Camera,
    public service: SimpleService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public renderer: Renderer,
    public domCtrl: DomController,
    public TranslationService: TranslationService,
    private modal: ModalController,
    public observableService: ObservableService
  ) {

    this.route.queryParams.subscribe(params => {
      if (params && params.requestInfo) {
        this.requestInfo = JSON.parse(params.requestInfo);
      }
    });

  }
  async ionViewWillEnter() {
    this.requestLoaded = false;
    if (!await this.storage.get('loaderToShow')) {
      await this.service.showLoader();
    }
    this.maxDateYear = new Date().getFullYear() + 5;
    this.storage.get('current_protocol').then((val) => {
      if (val) {
        this.currentProtocolId = val.id;
        this.currentProtocolName = val.name;
      }
    });

    this.currentSelectedRequestId = await this.storage.get('currentSelectedRequestId');

    this.storage.get('locations').then((locations) => {
      Object.keys(locations).map(key => {
        this.locations.push(locations[key]);
      });
    });

    this.initRequest();

    this.storage.get('rooms').then((room) => {
      Object.keys(room).map(key => {
        this.rooms.push(room[key]);
      });
    });

    this.storage.get('action').then((actions) => {
      this.actions = Object.keys(actions).map(key => {
        // this.actions.push(actions[key]);
        return ({id: Number(key), label: actions[key]});
      });
    });

    this.storage.get('cost_impact').then((costImpacts) => {
      this.costImpacts = Object.keys(costImpacts).map(key => {
        // this.costImpacts.push(costImpacts[key]);
        return ({id: Number(key), label: costImpacts[key]});
      });
    });

    this.storage.get('request_categories').then((categories) => {
      Object.keys(categories).map(key => {
        this.request_categories.push(categories[key]);
      });
    });

    this.currentComponentIndex = 0;
  }

  ionViewDidLeave() {
  }

  ngOnInit() {
    // this.initRequest();
    this.storage.get('service_providers').then((serviceProviders) => {
      if (serviceProviders) {
        this.service_providers = serviceProviders;
      }
    });
  }

  async initRequest() {

    await this.TranslationService.getTranslations();
    this.isLastComponent = false;
    this.all_components = await this.storage.get('all_components');
    const current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    this.request_data = await this.storage.get('request_data');
    this.currentRoomLength = submit_data[current_index].rooms.length;
    this.partiesInfo = submit_data[current_index].parties;
    // protocol 1
    if (this.currentProtocolId === 1 || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id == '')) {
      this.currentComponentIndex = this.requestInfo.component_id;
      if (this.currentSelectedRequestId === '') {
          if (this.currentComponentIndex === 1) {
              this.activeCategoryID = 3;
          } else {
              this.activeCategoryID = 4;
          }
      }
      let currentFloor: any;
      if ( this.partiesInfo.unit_id !== '') {
          currentFloor = submit_data[current_index].rooms.filter(floor => floor.id === this.requestInfo.id)[0];
          if (currentFloor.hasOwnProperty('full_url') && currentFloor.full_url != '' && currentFloor.hasOwnProperty('plan_id') && currentFloor.plan_id != '') {
              this.hasPlan = true;
          }
      } else {
          currentFloor = submit_data[current_index].floors.filter(floor => floor.id === this.requestInfo.id)[0];
          if (currentFloor.hasOwnProperty('plan_full_url') && currentFloor.plan_full_url != '') {
              this.hasPlan = true;
          }
      }
      this.currentRoomName = currentFloor.name;
      this.title = '';
      this.description = '';
      this.costbyprotocol = 1;
      this.actionprotocol = 1;
      this.service_provider = '';

      this.sharedValue = 0;
      // this.currentLocation = 1;
      if (this.currentSelectedRequestId !== '') {
          const request = currentFloor.request[this.currentSelectedRequestId];
          if (!this.request_data.isUpdated) {
            this.activeCategoryID = request.category_id;
            if (this.activeCategoryID === 3) {
                this.request_data.deficiency.title = request.title;
                this.request_data.deficiency.description = request.description;
                this.request_data.deficiency.service_provider = request.service_provider;
                this.request_data.deficiency.plan_location = request.plan_location;
                this.request_data.deficiency.plan_id = request.plan_id;
                this.request_data.deficiency.actionprotocol = request.action;
                this.request_data.deficiency.costbyprotocol = request.cost_by.method;
                this.request_data.deficiency.sharedValue = request.cost_by.value;
                this.request_data.deficiency.inspection_images = request.inspection_images;
                this.request_data.deficiency.due_date = request.due_date;
                this.title = this.request_data.deficiency.title;
                this.description = this.request_data.deficiency.description;
                this.inspection_images = this.request_data.deficiency.inspection_images;
                this.due_date = this.request_data.deficiency.due_date;
            } else {
                this.request_data.open_issue.title = request.title;
                this.request_data.open_issue.description = request.description;
                this.request_data.open_issue.service_provider = request.service_provider;
                this.request_data.open_issue.plan_location = request.plan_location;
                this.request_data.open_issue.plan_id = request.plan_id;
                this.request_data.open_issue.inspection_images = request.inspection_images;
                this.request_data.open_issue.due_date = request.due_date;
                this.title = this.request_data.open_issue.title;
                this.description = this.request_data.open_issue.description;
                this.inspection_images = this.request_data.open_issue.inspection_images;
                this.due_date = this.request_data.open_issue.due_date;
            }
          } else {
            //if (this.currentProtocolId === 1) {
              if (this.activeCategoryID === 3) {
                  this.description = this.request_data.deficiency.description;
              } else {
                  this.description = this.request_data.open_issue.description;
              }
            //}
          }
      } else {
          if (this.currentProtocolId == 1) {
             // this.service_provider = this.partiesInfo.service_provider;
          }
          if (this.activeCategoryID === 3) {
              if (this.currentProtocolId == 1) {
                //  this.request_data.deficiency.service_provider = this.service_provider;
              }
              this.description = this.request_data.deficiency.description;
          } else {
              if (this.currentProtocolId == 1) {
                //  this.request_data.open_issue.service_provider = this.service_provider;
              }
              this.description = this.request_data.open_issue.description;
          }
      }
      this.currentLocation = await this.storage.get('current_location');
    }

    // protocol 4
    if ((this.currentProtocolId === 4 || this.currentProtocolId === 5) || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id != '')) {
        let request_categories = await this.storage.get('request_categories');
        Object.keys(request_categories).map((key) => {
            if (key != '2' && key != '3' && key != '4') {
                delete request_categories[key];
            }
        });
      const request_categories_p2 = request_categories;
      await this.storage.set('request_categories_p2', request_categories_p2);
      let active_room = submit_data[current_index].rooms.find(room => room.id == this.requestInfo.id);
      if (active_room.hasOwnProperty('full_url') && active_room.full_url != '' && active_room.hasOwnProperty('plan_id') && active_room.plan_id != '') {
          this.hasPlan = true;
      }
      this.currentRoomId = active_room.id;
      this.currentRoomName = active_room.name;
      if (submit_data[current_index].rooms[this.currentRoomLength - 1].id == this.currentRoomId) {
        this.isNextRoomBtn = false;
      }
      if (active_room.complete) this.goToNextRoom = false;

      if (active_room.components == null || active_room.components.length == 0) {
        // active_room.components = this.all_components.filter(item => {
        //   return active_room.component_ids.includes(item.id);
        // });

        active_room.components.map(comp => comp.complete = false);
        active_room.complete_count = 0;
      }
      this.room_components = active_room.components;
      // await this.storage.set('submit_data', submit_data);

      if(this.isNextComponent){
        this.isNextComponent = false;
      }
      else{
        this.currentComponentIndex = this.requestInfo.component_id;
      }

      let active_component = this.room_components[this.currentComponentIndex];
      this.currentComponentName = this.room_components[this.currentComponentIndex].name;
      let request = active_component.request;

      if(this.currentComponentIndex == (active_room.components_count - 1)){
        this.isLastComponent = true;
      }

      if (this.currentComponentIndex == (active_room.components_count-1)  || this.currentComponentIndex == (active_room.components_count-1) && active_component.complete == false) {
        this.isRemainNextComponent = false;
      }else{
        this.isRemainNextComponent = true;
      }

      if (active_component.complete == true) {

        this.activeCategoryID = active_component.category_id;

        if(this.request_data.isUpdated != true){

          if (this.activeCategoryID == 0) {
            //set subcategory is Inordung
          }
          let request_id = '';
          if (request.hasOwnProperty('request_id')) {
              request_id = request.request_id;
          }
          if (this.activeCategoryID == 2) {
            this.request_data.deficiency.request_id = request_id;
            this.request_data.deficiency.title = request.title;
            this.request_data.deficiency.description = request.description;
            this.request_data.deficiency.service_provider = request.service_provider;
            this.request_data.deficiency.plan_location = request.plan_location;
            this.request_data.deficiency.plan_id = request.plan_id;
            this.request_data.deficiency.actionprotocol = request.action;
            this.request_data.deficiency.costbyprotocol = request.cost_by.method;
            this.request_data.deficiency.sharedValue = request.cost_by.value;
            this.request_data.deficiency.inspection_images = request.inspection_images;

          } else if (this.activeCategoryID == 1) {
            this.request_data.normal_wear.request_id = request_id;
            this.request_data.normal_wear.title = request.title;
            this.request_data.normal_wear.description = request.description;
            this.request_data.normal_wear.plan_location = request.plan_location;
            this.request_data.normal_wear.plan_id = request.plan_id;
            this.request_data.normal_wear.inspection_images = request.inspection_images;

          } else if (this.activeCategoryID == 3) {
            this.request_data.re_cleaning.request_id = request_id;
            this.request_data.re_cleaning.title = request.title;
            this.request_data.re_cleaning.description = request.description;
            this.request_data.re_cleaning.service_provider = request.service_provider;
            this.request_data.re_cleaning.plan_location = request.plan_location;
            this.request_data.re_cleaning.plan_id = request.plan_id;
            this.request_data.re_cleaning.costbyprotocol = request.cost_by.method;
            this.request_data.re_cleaning.sharedValue = request.cost_by.value;
            this.request_data.re_cleaning.inspection_images = request.inspection_images;

          } else if (this.activeCategoryID == 4) {
            this.request_data.non_existent.request_id = request_id;
            this.request_data.non_existent.title = request.title;
            this.request_data.non_existent.description = request.description;
            this.request_data.non_existent.service_provider = request.service_provider;
            this.request_data.non_existent.plan_location = request.plan_location;
            this.request_data.non_existent.plan_id = request.plan_id;
            this.request_data.non_existent.costbyprotocol = request.cost_by.method;
            this.request_data.non_existent.sharedValue = request.cost_by.value;
            this.request_data.non_existent.inspection_images = request.inspection_images;
          }
        }

        if(this.request_data.isUpdated == true){

          if(this.activeCategoryID != this.request_data.activeId){
            this.activeCategoryID = this.request_data.activeId ;
          }
         // this.request_data.isUpdated = false;
        }
        else {
          if(this.activeCategoryID != this.request_data.activeId){
            this.request_data.activeId = this.activeCategoryID;
          }
        }
      }
      else {
        this.activeCategoryID = 2;
        this.actionprotocol = 1;
        this.activeCategoryID = this.request_data.activeId;
      }

      if(this.activeCategoryID == 0){
        this.title = '';
        this.description = '';
        this.costbyprotocol = 1;
        this.actionprotocol = 1;
        this.service_provider = '';
        this.sharedValue = 0;
      } else if(this.activeCategoryID == 1){
        this.title = this.request_data.normal_wear.title;
        this.description = this.request_data.normal_wear.description;
        this.inspection_images = this.request_data.normal_wear.inspection_images;
      }
      else if(this.activeCategoryID == 2){
        this.title = this.request_data.deficiency.title;
        this.description = this.request_data.deficiency.description;      
        this.inspection_images = this.request_data.deficiency.inspection_images;        
      }
      else if(this.activeCategoryID == 3){
        this.title = this.request_data.re_cleaning.title;
        this.description = this.request_data.re_cleaning.description;
        this.inspection_images = this.request_data.re_cleaning.inspection_images;        
      }
      else if(this.activeCategoryID == 4){
        this.title = this.request_data.non_existent.title;
        this.description = this.request_data.non_existent.description;
        this.inspection_images = this.request_data.non_existent.inspection_images;        
      }
    }
    if (this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.rooms, this.currentRoomName) && ((this.currentProtocolId !== 1 && this.currentProtocolId !== 2 && this.currentProtocolId !== 3) || ((this.currentProtocolId ==1 || this.currentProtocolId ==2 || this.currentProtocolId ==3) && this.partiesInfo && this.partiesInfo.unit_id !== ''))) {
      this.headerbackTitle = 'rooms.' + this.currentRoomName;
    }
    if (!this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.rooms, this.currentRoomName) && ((this.currentProtocolId !== 1 && this.currentProtocolId !== 2 && this.currentProtocolId !== 3) || ((this.currentProtocolId ==1 || this.currentProtocolId ==2 || this.currentProtocolId ==3) && this.partiesInfo && this.partiesInfo.unit_id !== ''))) {
      this.headerbackTitle = this.currentRoomName;
    }
    if (this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.floors, this.currentRoomName) && ((this.currentProtocolId == 1 || this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo && this.partiesInfo.unit_id == '')) {
      this.headerbackTitle = 'floors.' + this.currentRoomName;
    }
    if (!this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.floors, this.currentRoomName) && ((this.currentProtocolId == 1 || this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo && this.partiesInfo.unit_id == '')) {
      this.headerbackTitle = this.currentRoomName;
    }
    if ((this.currentProtocolId !== 1 && this.currentProtocolId !== 2 && this.currentProtocolId !== 3) || ((this.currentProtocolId ==2 || this.currentProtocolId ==3) && this.partiesInfo && this.partiesInfo.unit_id !== '')) {
      if (this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.components, this.currentComponentName)) {
        this.headerTitle = 'components.' + this.currentComponentName;
      } else {
        this.headerTitle = this.currentComponentName;
      }
    }
    if (this.currentProtocolId == 1 || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo && this.partiesInfo.unit_id == '')) {
      if (this.requestInfo.component_id == 1 || this.requestInfo.component_id == 3) {
        this.headerTitle = 'offline_tool.main_categories.deficiency';
      }
      if (this.requestInfo.component_id ==2 || this.requestInfo.component_id == 4) {
        this.headerTitle = 'offline_tool.main_categories.open_issue';
      }
    }
    await this.storage.set('request_data', this.request_data);
    if (this.request_data.isUpdated == true) {
        await this.checkValidatedFields();
    } else {
        this.requestLoaded = true;
        await this.service.hideLoader();
    }
  }

  async checkValidatedFields() {
      if (this.currentProtocolId === 1 || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id == '')) {
          if (this.activeCategoryID === 3) {
              if (this.request_data.deficiency.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.deficiency.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          } else {
              if (this.request_data.open_issue.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.open_issue.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          }
      } else {
          if (this.activeCategoryID == 1) {
              if (this.request_data.normal_wear.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.normal_wear.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          } else if (this.activeCategoryID == 2) {
              if (this.request_data.deficiency.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.deficiency.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          } else if (this.activeCategoryID == 3) {
              if (this.request_data.re_cleaning.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.re_cleaning.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          } else if (this.activeCategoryID == 4) {
              if (this.request_data.non_existent.title !== '') {
                  this.requiredTitleLabel = false;
              }
              if (this.request_data.non_existent.plan_location.length > 0) {
                  this.requiredLocationLabel = false;
              }
          }
      }
      this.requestLoaded = true;
      await this.service.hideLoader();
  }
  openCam() {
    const category = this.activeCategoryID;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(async (imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.inspection_images.push({ img: this.image });
      if (category === 2) {
        this.request_data.deficiency.inspection_images = this.inspection_images;
      } else if (category === 1) {
        this.request_data.normal_wear.inspection_images = this.inspection_images;
      } else if (category === 3) {
        if (this.currentProtocolId === 1) {
            this.request_data.deficiency.inspection_images = this.inspection_images;
        } else {
            this.request_data.re_cleaning.inspection_images = this.inspection_images;
        }
      } else if (category === 4) {
          if (this.currentProtocolId === 1) {
              this.request_data.open_issue.inspection_images = this.inspection_images;
          } else {
              this.request_data.non_existent.inspection_images = this.inspection_images;
          }
      }
      await this.storage.set('request_data', this.request_data);
    }, (err) => {
      alert('error ' + JSON.stringify(err));
    });

  }

  getImages() {
    const category = this.activeCategoryID;
    let images = [];
    if (category === 2) {
      images = this.request_data.deficiency.inspection_images;
    } else if (category === 1) {
      images = this.request_data.normal_wear.inspection_images;
    } else if (category === 3) {
        if(this.currentProtocolId === 1) {
            images = this.request_data.deficiency.inspection_images;
        } else {
            images = this.request_data.re_cleaning.inspection_images;
        }
    } else if (category === 4) {
        if(this.currentProtocolId === 1) {
            images = this.request_data.open_issue.inspection_images;
        } else {
            images = this.request_data.non_existent.inspection_images;
        }
    }
    return images;
  }

  isImagesEmpty() {
    const category = this.activeCategoryID;
    let isEmpty: boolean = false;
    if (category === 2) {
      isEmpty = typeof this.request_data.deficiency.inspection_images === 'undefined' || !this.request_data.deficiency.inspection_images.length ? true : false;
    } else if (category === 1) {
      isEmpty = typeof this.request_data.normal_wear.inspection_images === 'undefined' || !this.request_data.normal_wear.inspection_images.length ? true : false;
    } else if (category === 3) {
        if (this.currentProtocolId === 1) {
            isEmpty = typeof this.request_data.deficiency.inspection_images === 'undefined' || !this.request_data.deficiency.inspection_images.length ? true : false;
        } else {
            isEmpty = typeof this.request_data.re_cleaning.inspection_images === 'undefined' || !this.request_data.re_cleaning.inspection_images.length ? true : false;
        }
    } else if (category === 4) {
        if (this.currentProtocolId === 1) {
            isEmpty = typeof this.request_data.open_issue.inspection_images == 'undefined' || !this.request_data.open_issue.inspection_images.length ? true : false;
        } else {
            isEmpty = typeof this.request_data.non_existent.inspection_images == 'undefined' || !this.request_data.non_existent.inspection_images.length ? true : false;
        }
    }

    return isEmpty;
  }

  showMarker(request_category) {
      if ((this.currentProtocolId == 4 || this.currentProtocolId == 5) || ((this.currentProtocolId === 1 || this.currentProtocolId == 2 || this.currentProtocolId == 3)
                  && this.partiesInfo.unit_id != '')) {
          if (request_category == 2) {
              this.request_data.deficiency.description = this.description;
          } else if (request_category == 1) {
              this.request_data.normal_wear.description = this.description;
          } else if (request_category == 3) {
              this.request_data.re_cleaning.description = this.description;
          } else if (request_category == 4) {
              this.request_data.non_existent.description = this.description;
          }
      } else if ((this.currentProtocolId === 1) ||
                ((this.currentProtocolId == 2 || this.currentProtocolId == 3)
                && this.partiesInfo.unit_id == '')) {
          if (request_category === 3) {
              this.request_data.deficiency.description = this.description;
          } else {
              this.request_data.open_issue.description = this.description;
          }
      }
      return this.hasPlan;
  }

  async gofurther(componentIndex, request_category, type) {
    let isEmpty = false;
    if ((this.currentProtocolId === 1) || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id == '')) {
        if (request_category === 3) {
            this.request_data.deficiency.description = this.description;
            if (this.request_data.deficiency.title === '' ||
                (this.request_data.deficiency.hasOwnProperty('plan_id') && this.request_data.deficiency.plan_id == '' && this.request_data.deficiency.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.deficiency.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.deficiency.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        } else {
            this.request_data.open_issue.description = this.description;
            if (this.request_data.open_issue.title === '' ||
                (this.request_data.open_issue.hasOwnProperty('plan_id') && this.request_data.open_issue.plan_id == '' && this.request_data.open_issue.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.open_issue.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.open_issue.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        }
    } else {
        if (request_category == 2) {
            this.request_data.deficiency.description = this.description;
            if (!this.request_data.deficiency.title ||
                (this.request_data.deficiency.hasOwnProperty('plan_id') && this.request_data.deficiency.plan_id == '' && this.request_data.deficiency.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.deficiency.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.deficiency.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        } else if (request_category == 1) {
            this.request_data.normal_wear.description = this.description;
            if (!this.request_data.normal_wear.title ||
                (this.request_data.normal_wear.hasOwnProperty('plan_id') && this.request_data.normal_wear.plan_id == '' && this.request_data.normal_wear.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.normal_wear.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.normal_wear.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        } else if (request_category == 3) {
            this.request_data.re_cleaning.description = this.description;
            if (!this.request_data.re_cleaning.title ||
                (this.request_data.re_cleaning.hasOwnProperty('plan_id') && this.request_data.re_cleaning.plan_id == '' && this.request_data.re_cleaning.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.re_cleaning.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.re_cleaning.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        } else if (request_category == 4) {
            this.request_data.non_existent.description = this.description;
            if (!this.request_data.non_existent.title ||
                (this.request_data.non_existent.hasOwnProperty('plan_id') && this.request_data.non_existent.plan_id == '' && this.request_data.non_existent.plan_location.length == 0 && this.hasPlan)) {
                if (this.request_data.non_existent.title === '') {
                    this.requiredTitleLabel = true;
                }
                if (this.request_data.non_existent.plan_location.length == 0) {
                    this.requiredLocationLabel = true;
                }
                isEmpty = true;
            }
        }
    }

    if (isEmpty == true) {
        this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_all_required_fields);
        return;

    } else {
      this.observableService.isRoomsChanged = true;
      this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
      if ((this.currentProtocolId === 4 || this.currentProtocolId === 5) || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id != '')) {
        let active_component = this.room_components[componentIndex];
        this.currentComponentName = active_component.name;
        active_component.category_id = request_category;
        active_component.complete = true;

        if (componentIndex == this.room_components.length - 1) {
          this.isRemainNextComponent = false;
        } else {
          this.currentComponentIndex++;
        }
        this.currentComponentName = this.room_components[this.currentComponentIndex].name;
        let request: any;
        if (request_category === 2) {
          request = {
            request_id: this.request_data.deficiency.request_id,
            title: this.request_data.deficiency.title,
            description: this.request_data.deficiency.description,
            service_provider: this.request_data.deficiency.service_provider,
            action: this.request_data.deficiency.actionprotocol,
            cost_by: {
              method: this.request_data.deficiency.costbyprotocol,
              value: this.request_data.deficiency.sharedValue
            },
            inspection_images: this.inspection_images,
            plan_location: this.request_data.deficiency.plan_location,
            plan_id: this.request_data.deficiency.plan_id
          }
        } else if (request_category === 1) {
          request = {
            request_id: this.request_data.normal_wear.request_id,
            title: this.request_data.normal_wear.title,
            description: this.request_data.normal_wear.description,
            inspection_images: this.inspection_images,
            plan_location: this.request_data.normal_wear.plan_location,
            plan_id: this.request_data.normal_wear.plan_id
          };
        } else if (request_category === 3) {
          request = {
            request_id: this.request_data.re_cleaning.request_id,
            title: this.request_data.re_cleaning.title,
            description: this.request_data.re_cleaning.description,
            service_provider: this.request_data.re_cleaning.service_provider,
            cost_by: {
              method: this.request_data.re_cleaning.costbyprotocol,
              value: this.request_data.re_cleaning.sharedValue
            },
            inspection_images: this.inspection_images,
            plan_location: this.request_data.re_cleaning.plan_location,
            plan_id: this.request_data.re_cleaning.plan_id
          };
        } else if (request_category === 4) {
          request = {
            request_id: this.request_data.non_existent.request_id,
            title: this.request_data.non_existent.title,
            description: this.request_data.non_existent.description,
            service_provider: this.request_data.non_existent.service_provider,
            cost_by: {
              method: this.request_data.non_existent.costbyprotocol,
              value: this.request_data.non_existent.sharedValue
            },
            inspection_images: this.inspection_images,
            plan_location: this.request_data.non_existent.plan_location,
            plan_id: this.request_data.non_existent.plan_id
          };
        }

        var current_index = await this.storage.get('current_index');
        var submit_data = await this.storage.get('submit_data');
        let active_room = submit_data[current_index].rooms.find(room => room.id === this.requestInfo.id);

        if (active_room.components == null) {
          active_room.components = [];
        }

        // let savingComponent = active_room.components.find(item => item.id === active_component.id);
        let savingComponent = active_component;

        if (request.hasOwnProperty('request_id')) {
            if ( request.request_id == '' || typeof request.request_id == 'undefined') {
                delete request.request_id;
            }
        }
        if(!request) {
            request = {};
        }
        if (savingComponent.request == null) {

          savingComponent.request = request;
          active_component.complete = true;
          active_room.components = this.room_components;
          active_room.complete_count += 1;
        } else {
          savingComponent.request = request;
          active_component.complete = true;
          active_room.components = this.room_components;
        }

        this.room_components.sort((a, b) => {
          return b.complete - a.complete;
        });

        if (active_room.complete_count == active_room.components_count) {
          active_room.complete = true;
        }

        if(this.currentComponentIndex > active_room.complete_count ){
          this.currentComponentIndex = active_room.complete_count;
        }

        await this.storage.set('submit_data', submit_data);
        await this.service.updateRooms(this.requestInfo.id);
        this.request_data = {
          activeId:2,
          deficiency:{title:'', description:'', service_provider:'', actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
          normal_wear:{title:'', description:'', plan_location: [], plan_id: '', inspection_images:[]},
          re_cleaning:{title:'', description:'', service_provider:'', costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
          non_existent:{title:'', description:'', service_provider:'', costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
        } ;

        await this.storage.set('request_data', this.request_data);
        if (this.currentComponentIndex === (active_room.components_count - 1)) {
          this.isLastComponent = true;
        }

        // Initialize the input Value
        this.title = '';
        this.description = '';
        this.activeCategoryID = 2;
        this.inspection_images = [];

        if ((active_room.complete_count === (active_room.components_count - 1)) && this.room_components[this.currentComponentIndex].complete === false) {
          this.isRemainNextComponent = false;
        } else {
          this.isRemainNextComponent = true;
        }
      } else if (this.currentProtocolId === 1 ||  ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
          const current_index = await this.storage.get('current_index');
          let submit_data = await this.storage.get('submit_data');
          let active_floor: any;
          if (this.partiesInfo.unit_id !== '') {
              active_floor = submit_data[current_index].rooms.find(floor => floor.id === this.requestInfo.id);
          } else {
              active_floor = submit_data[current_index].floors.find(floor => floor.id === this.requestInfo.id);
          }

          let request = {};
          let currentLocation = {id: ''};
          if (this.currentLocation) {
              currentLocation = this.currentLocation;
          }
          if (request_category === 3) {
              request = {
                  location_id: currentLocation.id,
                  category_id: this.activeCategoryID,
                  title: this.request_data.deficiency.title,
                  description: this.request_data.deficiency.description,
                  service_provider: this.request_data.deficiency.service_provider,
                  action: this.request_data.deficiency.actionprotocol,
                  cost_by: {
                      method: this.request_data.deficiency.costbyprotocol,
                      value: this.request_data.deficiency.sharedValue
                  },
                  inspection_images: this.inspection_images,
                  plan_location: this.request_data.deficiency.plan_location,
                  plan_id: this.request_data.deficiency.plan_id,
                  complete: true
              };
          }  else if (request_category === 4) {
              request = {
                  location_id: currentLocation.id,
                  category_id: this.activeCategoryID,
                  title: this.request_data.open_issue.title,
                  description: this.request_data.open_issue.description,
                  service_provider: this.request_data.open_issue.service_provider,
                  inspection_images: this.inspection_images,
                  plan_location: this.request_data.open_issue.plan_location,
                  plan_id: this.request_data.open_issue.plan_id,
                  due_date: this.request_data.open_issue.due_date,
                  complete: true
              };
          }
          if (active_floor.request) {
              if (this.currentSelectedRequestId !== '') {
                  active_floor.request[this.currentSelectedRequestId] = request;
              } else {
                  active_floor.request.push(request);
              }
          } else {
              active_floor.request = [];
              active_floor.request.push(request);
          }
          if (request_category == 3) {
              if (active_floor.hasOwnProperty('deficiencyCount') && active_floor.deficiencyCount != '') {
                  active_floor.deficiencyCount = parseInt(active_floor.deficiencyCount) + 1;
              } else {
                  active_floor.deficiencyCount = 1;
              }
          } else {
              if (active_floor.hasOwnProperty('openissueCount') && active_floor.openissueCount != '') {
                  active_floor.openissueCount = parseInt(active_floor.openissueCount) + 1;
              } else {
                  active_floor.openissueCount = 1;
              }
          }

          await this.storage.set('submit_data', submit_data);
          await this.service.updateFloors(this.requestInfo.id, this.partiesInfo.unit_id);
          this.request_data = {
              activeId:2,
              deficiency:{title:'', description:'', service_provider:'', actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', due_date: '', inspection_images:[]},
              normal_wear:{title:'', description:'', plan_location: [], plan_id: '', inspection_images:[]},
              re_cleaning:{title:'', description:'', service_provider:'', costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
              non_existent:{title:'', description:'', service_provider:'', costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', due_date: '', inspection_images:[]},
              open_issue:{title:'', description:'', service_provider:'', plan_location: [], plan_id: '', due_date: '', inspection_images:[]},
          };
      }

      setTimeout(() => {
        this.service.hideLoader();
      }, 500);
      // back to room object page
      if (type === 'back') {
        this.goToRoomObject();
      }

      // next room page
      if (type === 'nextRoom') {
        this.goToNextRoomInspection();
      }

      // next component page
      if (type === 'nextComponent') {
        this.isNextComponent = true;
        this.initRequest();
      }
    }
  }

  async goToNextRoomInspection() {
    let current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    this.requestInfo.id = submit_data[current_index].rooms[this.currentRoomId].id;
    this.currentRoomName = submit_data[current_index].rooms[this.currentRoomId].name;
    this.goToNextRoom = true;
    this.initRequest();
  }
  goToRoomObject() {
      this.navigationExtras = {
          queryParams: {
              roomInfo: JSON.stringify({id: this.requestInfo.id, room_name: this.currentRoomName})
          }
      };
      if (this.request_data.isUpdated) {
          this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
              this.router.navigate(['/room-object'], this.navigationExtras);
          });
      } else {
          this.router.navigate(['/room-object'], this.navigationExtras);
      }
  }

  getActiveCategoryName(index) {
    let categoryName = '';
    index = index / 1;
    switch(index){
      case 0:
        categoryName = 'okay';
        break;
      case 2:
        categoryName = 'deficiency';
        break;
      case 1:
        categoryName = 'normal_wear';
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            categoryName = 'deficiency';
        } else {
            categoryName = 're_cleaning';
        }
        break;
      case 4:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            categoryName = 'open_issue';
        } else {
            categoryName = 'non_existent';
        }
        break;
      default:
        categoryName = 'okay';
        break;
    }

    return categoryName ;
  }

  async goToRequestInnerPage(filedId) {
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
    let fieldValue = null;
    // if(filedId == 'subcategory'){
    //   this.storage.set('filter_list_name', 'service_provider');
    //   fieldValue = this.activeCategoryID;
    // }
    // if(filedId == 'service_provider'){
    //   this.storage.set('filter_list_name', 'service_provider');
    // }

    if(filedId == 'Action'){
      fieldValue = this.actionprotocol;
    }

    // await loading.present();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        requestInnerInfo: JSON.stringify({
          'id':this.requestInfo.id,
          'room_name':this.currentRoomName,
          'component_id':this.currentComponentIndex,
          'fieldId':filedId,
        })
      }
    }
 /*   setTimeout(() => {
      this.service.hideLoader();
    }, 500);*/

    this.router.navigate(['/request-inner'], navigationExtras);
  }

  getServiceProviderName() {
    let fullName = '';
    switch (this.activeCategoryID) {
      case 2:
        fullName = this.request_data.deficiency.service_provider !== '' ? this.getServiceFullName(this.request_data.deficiency.service_provider) : '';
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            fullName = this.request_data.deficiency.service_provider !== '' ? this.getServiceFullName(this.request_data.deficiency.service_provider) : '';
        } else {
            fullName = this.request_data.re_cleaning.service_provider !== '' ? this.getServiceFullName(this.request_data.re_cleaning.service_provider) : '';
        }
        break;
      case 4:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            fullName = this.request_data.open_issue.service_provider !== '' ? this.getServiceFullName(this.request_data.open_issue.service_provider) : '';
        } else {
            fullName = this.request_data.non_existent.service_provider !== '' ? this.getServiceFullName(this.request_data.non_existent.service_provider) : '';
        }
        break;
    }
    return fullName;
  }

  getActionLabelFromId(actionId) {
    if(actionId != '' && actionId != null) {
        const selectedAction = this.actions.filter(action => {
            return action.id === actionId;
        });

        return selectedAction[0].label;
    } else {
        return '';
    }
  }

  getCostLabelFromId(costId){
      if(costId !='' && costId != null) {
          let selectedAction = this.costImpacts.filter(costImpact => {
              return costImpact.id == costId;
          });

          return selectedAction[0].label;
      } else {
          return '';
      }
  }

  getActionLabel(){
    let label = '';
    let labelKey = '';

    switch (this.activeCategoryID) {
      case 2:
        labelKey = this.getActionLabelFromId(this.request_data.deficiency.actionprotocol);
        label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.action, labelKey);
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            labelKey = this.getActionLabelFromId(this.request_data.deficiency.actionprotocol);
            label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.action, labelKey);
        }
        break;
      default:
        break;
    }

    return label;
  }

  getCostLabel() {
    let label = '';
    let value = 0;
    let labelKey = '';

    switch (this.activeCategoryID) {
      case 2:
        labelKey = this.getCostLabelFromId(this.request_data.deficiency.costbyprotocol);
        label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.cost_impact, labelKey);
        if (this.request_data.deficiency.costbyprotocol === 3) {
            label = this.TranslationService.translateText(this.TranslationService.translationsList.offline_tool.labels, 'shared_costs_short');
            value = this.request_data.deficiency.sharedValue;
        }
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            labelKey = this.getCostLabelFromId(this.request_data.deficiency.costbyprotocol);
            label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.cost_impact, labelKey);
            if (this.request_data.deficiency.costbyprotocol === 3) {
                label = this.TranslationService.translateText(this.TranslationService.translationsList.offline_tool.labels, 'shared_costs_short');
                value = this.request_data.deficiency.sharedValue;
            }
        } else {
            labelKey = this.getCostLabelFromId(this.request_data.re_cleaning.costbyprotocol);
            label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.cost_impact, labelKey);
            if (this.request_data.re_cleaning.costbyprotocol === 3) {
                label = this.TranslationService.translateText(this.TranslationService.translationsList.offline_tool.labels, 'shared_costs_short');
                value = this.request_data.re_cleaning.sharedValue;
            }
        }
        break;
      case 4:
          labelKey = this.getCostLabelFromId(this.request_data.non_existent.costbyprotocol);
          label = this.TranslationService.translateText(this.TranslationService.translationsList.requests.cost_impact, labelKey);
          if (this.request_data.non_existent.costbyprotocol === 3) {
              label = this.TranslationService.translateText(this.TranslationService.translationsList.offline_tool.labels, 'shared_costs_short');
              value = this.request_data.non_existent.sharedValue;
          }
        break;
    }
    if (value > 0) {
      label = label + '; ' + value + '%';
    }
    return label;
  }

  getTitle() {
    let title = '';

    switch (this.activeCategoryID) {
      case 2:
        title = this.request_data.deficiency.title;
        break;
      case 1:
        title = this.request_data.normal_wear.title;
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            title = this.request_data.deficiency.title;
        } else {
            title = this.request_data.re_cleaning.title;
        }
        break;
      case 4:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            title = this.request_data.open_issue.title;
        } else {
            title = this.request_data.non_existent.title;
        }
        break;
    }
    return title;
  }


  locationSet() {
    let locationValue = '';
    switch (this.activeCategoryID) {
      case 2:
        if (this.request_data.deficiency.plan_location.length > 0) {
          locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
        }
        break;
      case 1:
        if (this.request_data.normal_wear.plan_location.length > 0) {
          locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
        }
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            if (this.request_data.deficiency.plan_location.length > 0) {
                locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
            }
        } else {
            if (this.request_data.re_cleaning.plan_location.length > 0) {
                locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
            }
        }
        break;
      case 4:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            if (this.request_data.open_issue.plan_location.length > 0) {
                locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
            }
        } else {
            if (this.request_data.non_existent.plan_location.length > 0) {
                locationValue = this.TranslationService.translationsList.offline_tool.labels.location_selected;
            }
        }
        break;
    }
    return locationValue;
  }

  async setDescription() {
    switch (this.activeCategoryID) {
      case 2:
        this.request_data.deficiency.description = this.description;
        break;
      case 1:
        this.request_data.normal_wear.description = this.description;
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            this.request_data.deficiency.description = this.description;
        } else {
            this.request_data.re_cleaning.description = this.description;
        }
        break;
      case 4:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            this.request_data.open_issue.description = this.description;
        } else {
            this.request_data.non_existent.description = this.description;
        }
        break;
    }
    this.request_data.isUpdated = true;
    await this.storage.set('request_data', this.request_data);
  }

    async setToDate() {
        this.request_data.open_issue.due_date = this.due_date;
        await this.storage.set('request_data', this.request_data);
    }


    getCategoryName() {
    let catName = '';
    if (this.activeCategoryID === 0) {
        catName = this.TranslationService.translationsList.offline_tool.categories[this.getActiveCategoryName(this.activeCategoryID)];
    } else {
        catName = this.TranslationService.translationsList.requests.category[this.getActiveCategoryName(this.activeCategoryID)];
    }
    return catName;
  }

  getServiceFullName(id) {
    let fullName = '';

    if (id == null) {
      return fullName;
    } else {
      const nameObj = this.service_providers.filter(item => item.id === id);
      fullName = nameObj[0].first_name + ' ' + nameObj[0].last_name;
      return fullName;
    }
  }

  changeDescription($evt) {
    this.setDescription();
  }

  getLocationName() {
    
    if (this.currentLocation === null || typeof this.currentLocation === 'undefined') {
      return '';
    } else {
      const currentLocation = this.locations[this.currentLocation.id - 1];
      return currentLocation.name;
    }
  }

  async openDatePicker() {
    const datePickerModal = await this.modal.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
        'objConfig': this.service.getdatePickerObj(), 
        'selectedDate': this.due_date 
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss()
    .then((data) => {
      if(data.data.date!="Invalid date"){
        this.due_date = data.data.date;
        this.setToDate();
      }
    });
  }

  async openModal(index) {
    const modalProps = { index: index, images:this.inspection_images}
    const modal =
      await this.modal.create({
        component: ImagePopupPage,
        cssClass: 'gallery-modal',
        componentProps: {data: modalProps}
      });
    await modal.present();
  }

  async removeImage(index) {
    // let confirmed  = confirm("Are you sure to remove it?");
   /* const alert = this.alertController.create({
      message: this.TranslationService.translationsList.offline_tool.messages.are_you_sure,
      buttons: [
        {
            text: this.TranslationService.translationsList.offline_tool.labels.no,
            handler: () => {
                // console.log('Cancel No clicked');
            }
        },
        {
            text: this.TranslationService.translationsList.offline_tool.labels.yes,
            handler: () => {

              let temp:any = [];
              this.inspection_images.map((image, key) => {
                if (key !== index) {
                  temp.push(image);
                }
              });
              this.inspection_images = [];
              this.inspection_images = temp;

              if (this.activeCategoryID === 2) {
                this.request_data.deficiency.inspection_images = this.inspection_images;
              } else if (this.activeCategoryID === 1) {
                this.request_data.normal_wear.inspection_images = this.inspection_images;
              } else if (this.activeCategoryID === 3) {
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.request_data.deficiency.inspection_images = this.inspection_images;
                } else {
                    this.request_data.re_cleaning.inspection_images = this.inspection_images;
                }
              } else if (this.activeCategoryID === 4) {
                  if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                      this.request_data.open_issue.inspection_images = this.inspection_images;
                  } else {
                      this.request_data.non_existent.inspection_images = this.inspection_images;
                  }
              }
              this.storage.set('request_data', this.request_data);
            }
        }
    ]
    });

    (await alert).present();*/
    // let confirmed = this.service.presentConfirmPopup('Are you sure to remove it?',) );
    // console.log(confirmed);
    this.service.presentConfirmPopup(this.TranslationService.translationsList.offline_tool.messages.are_you_sure_to_delete_gallery_image, async () => {

        let temp:any = [];
        this.inspection_images.map((image, key) => {
            if (key !== index) {
                temp.push(image);
            }
        });
        this.inspection_images = [];
        this.inspection_images = temp;

        if (this.activeCategoryID === 2) {
            this.request_data.deficiency.inspection_images = this.inspection_images;
        } else if (this.activeCategoryID === 1) {
            this.request_data.normal_wear.inspection_images = this.inspection_images;
        } else if (this.activeCategoryID === 3) {
            if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                this.request_data.deficiency.inspection_images = this.inspection_images;
            } else {
                this.request_data.re_cleaning.inspection_images = this.inspection_images;
            }
        } else if (this.activeCategoryID === 4) {
            if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                this.request_data.open_issue.inspection_images = this.inspection_images;
            } else {
                this.request_data.non_existent.inspection_images = this.inspection_images;
            }
        }
        await this.storage.set('request_data', this.request_data);
    });
    return;

  }

  removeImageItem() {
  }

}
