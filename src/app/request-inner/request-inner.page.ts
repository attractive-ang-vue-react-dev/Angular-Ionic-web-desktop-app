import { Component, OnInit, ViewChild, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController, IonContent, ModalController } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';
import { IonInput } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import 'hammerjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { TranslationService } from '../api/translation.service';
import { PanZoomConfig, PanZoomModel } from 'ng2-panzoom';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePopupPage } from '../image-popup/image-popup.page';
@Component({
  selector: 'app-request-inner',
  templateUrl: './request-inner.page.html',
  // host: {
  //   '(document:click)': 'onClick($event)',
  // },
  styleUrls: ['./request-inner.page.scss'],
})
export class RequestInnerPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonInput, { static: false }) inputField: IonInput;
  mainContainerHeight: number;
  activeTabIndex: any = 0;
  requestInnerInfo: any;
  room_components: any = [];
  rooms: any = [];
  openMarkerSlide: any = false;
  sybTabName: any;
  costby: any;
  image: any = ''
  all_components: any;  
  currentComponentIndex: any;
  currentComponentName: any;
  roomName: any;
  costbyprotocol: any;
  costbyprotocol1: any;
  actionprotocol: any;
  actionprotocol1: any;
  sharedValue: any;
  is_shared_cost: boolean = false;
  showSaveButton: boolean = false;
  selectedId: number;
  locationUrl: string;
  actions: any = [];
  costImpacts: any = [];
  service_providers: any = [];
  request_categories: any = [];
  current_index: any;
  protocolList: any;
  fieldId: any = '';
  fieldValue: any = '';
  selectedSubCategoryId: any = 0;
  isUpdated:Boolean = true;
//filter
  filterListType:any;
  filterListValue:any;
  listHeader: any;
  filterId: any;
  filterName: any;
  listArr:any = [];
  filteredListArr:any = [];
  title:any ;
  description:any ;

  request_data:any = [];
  currentRoomLength:any ;
  currentRoomId:any ;
  currentRoomName:any ;
  planId: string;
  //markder
  planLocation: any = [];
  ispdf: boolean;
  zoomIn: boolean = false;
  posX: number;
  posY: number;
  containerWidth: any;
  containerHeight: any;
  zoomedIn: boolean = false;
  originalLocationWidth: number;
  originalLocationHeight: number;
  lastPosX = 0;
  lastPosY = 0;
  isDragging = false;
  fieldTitle:any = ''; 
  inspection_images: any = []; 
  deficiency_slides: any = [];
  normal_wear_slides: any = [];
  re_cleaning_slides: any = [];
  non_existent_slides: any = [];
  locations:any = [];
  currentLocation:any;
  currentProtocolId:any;
  currentProtocolName: any;
  partiesInfo: any;
  @ViewChild('pinchZoom', { static: false }) pinchZoom;
  @ViewChild('panZoom', { static: false }) panZoom;
  @ViewChild('pdfViewer', { static: false }) pdfViewer: PdfViewerComponent;
  @ViewChild('locationContainer', { static: false }) locationContainer: ElementRef;
  @ViewChild('locationImg', { static: false }) locationImg: ElementRef;
  @ViewChild('marker', { static: false }) marker: ElementRef;
  @ViewChild('marker_deficiency', { static: false }) marker_deficiency: ElementRef;
  @ViewChild('marker_normal_wear', { static: false }) marker_normal_wear: ElementRef;
  @ViewChild('marker_re_cleaning', { static: false }) marker_re_cleaning: ElementRef;
  @ViewChild('marker_non_existent', { static: false }) marker_non_existent: ElementRef;
  showFilterList:boolean = false;

  draggable = false;
  useHandle = false;
  preventDefaultEvent = false;
  trackPosition = true;
  position;
  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  currentXPos;
  currentYPos;
  private panX = 0;
  private panY = 0;
  pdfScale: number;
  private modelChangedSubscription: Subscription;
  public panZoomConfig: PanZoomConfig = new PanZoomConfig;
  constructor(
    private storage: Storage,
    public loadingController: LoadingController,
    private camera: Camera,
    private router: Router,
    public service: SimpleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public TranslationService: TranslationService,
    private modal: ModalController,
  ) {
      this.route.queryParams.subscribe(params => {
          if (params && params.requestInnerInfo) {
            this.requestInnerInfo = JSON.parse(params.requestInnerInfo);
          }
      });
  }

  ngOnInit() {
    this.TranslationService.getTranslations();
    this.storage.get('protocol_types').then((val) => {
      if(val){
        this.protocolList = val;
      }
    });
    this.modelChangedSubscription = this.panZoomConfig.modelChanged.subscribe( (model: PanZoomModel) => {
      this.onModelChanged(model);
    });
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();  // don't forget to unsubscribe.  you don't want a memory leak!
  }

  onModelChanged(model: PanZoomModel): void {
    if (!model.isPanning) {
        console.log('current panzoom : ' + JSON.stringify(model));
        this.panX = model.pan.x;
        this.panY = model.pan.y;
        if (this.posX && this.posY) {
          let tempPosX = this.posX - this.panX;
          let tempPosY = this.posY - this.panY;
          console.log('panX : ' + this.panX + 'panY: ' + this.panY);
          console.log('posx : ' + tempPosX + 'posy: ' + tempPosY);
          this.calculateRealPostition(tempPosX, tempPosY);
        }
    }
  }
  async getPdfSize() {
    this.panX = 0;
    this.panY = 0;
    let pageContainer = document.getElementsByClassName('page');
    if(pageContainer.length > 0) {
      this.originalLocationWidth = pageContainer[pageContainer.length - 1].clientWidth;
      this.originalLocationHeight = pageContainer[pageContainer.length - 1].clientHeight;
      let locateContainer = document.getElementsByClassName("locateContainer");
      this.containerWidth = locateContainer[locateContainer.length - 1].clientWidth;
      this.containerHeight = locateContainer[locateContainer.length - 1].clientHeight;
      console.log("pw="+this.originalLocationWidth + "ph="+this.originalLocationHeight);
      console.log("cw="+this.containerWidth + "ch="+this.containerHeight);
      this.mainContainerHeight = (1100 * (this.originalLocationHeight + 1)) / (this.originalLocationWidth + 1);
      this.setPosition();
    }
    await this.service.hideLoader();
  }
  setPosition() {
    if (!!this.locationUrl) {
      this.posX = this.containerWidth / 2;
      this.posY = this.containerHeight / 2;
      this.position = {x: this.posX * -1, y: this.posY}; // {x: -250, y: 250};
      this.currentXPos = this.position.x;
      this.currentYPos = this.position.y;
      if (this.planLocation.length > 0) {
        this.panZoomConfig.initialZoomLevel = 2;
        this.panZoomConfig.initialZoomLevel = (this.containerWidth * this.panZoomConfig.initialZoomLevel) / this.originalLocationWidth;
        let splitScale = this.panZoom.zoomElementRef.nativeElement.style.transform.split("scale(");
        this.pdfScale = splitScale[1].split(")")[0];
        this.calculateContainerPosition();
      } else {
        this.panZoomConfig.initialZoomLevel = 2;
        this.panZoomConfig.initialZoomLevel = (this.containerWidth * this.panZoomConfig.initialZoomLevel) / this.originalLocationWidth;
        this.panZoom.resetView();
        let calculateRealPos = setTimeout(() => {
          this.calculateRealPostition(this.posX, this.posY);
        }, 500);
      }
      let hideMarker = setTimeout(() => {
        // let scaleX = this.containerWidth / this.originalLocationWidth;
        // let scaleY = this.containerHeight / this.originalLocationHeight;
        // this.panZoom.zoomElementRef.nativeElement.style.transform = "scale(" + scaleX + "," + scaleY + ")";
        let hammerZoom = new window['Hammer'](this.pdfViewer['element'].nativeElement);
        hammerZoom.get('pinch').set({
          enable: true
        });
        hammerZoom.on('doubletap', (ev) => {
          if (this.zoomedIn) {
            this.panZoom.zoomOut();
            // let hideMarker = setTimeout(() => {
            //   // let scaleX = this.containerWidth / this.originalLocationWidth;
            //   // let scaleY = this.containerHeight / this.originalLocationHeight;
            //   this.panZoom.panElementRef.nativeElement.style.transform = 'translate3d(0px, 0px, 0px)';
            //   // this.panZoom.zoomElementRef.nativeElement.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
            // }, 200);
          } else {
              this.panZoom.zoomIn();
        //     let hideMarker = setTimeout(() => {
        //     let translate3dPos = this.panZoom.panElementRef.nativeElement.style.transform.split("translate3d(");
        //     let allPos = translate3dPos[1].split("px");
        //     let posY3d = allPos[1].split(", ");
        //     let eventX = (this.originalLocationWidth + 0.5) * -1;
        //     let diffX = (this.currentXPos * -1) - ((eventX + ((parseInt(allPos[0]) * -1) + 0.5)) * -1 );
        //     let diffY = (this.currentYPos) - ((parseInt(posY3d[1]) * -1));
        //     this.position = {x: (this.currentXPos - diffX) + 13, y: (this.currentYPos + diffY) + 26};
        //     this.currentXPos = this.position.x;
        //     this.currentYPos = this.position.y;
        //   }, 200);
          }
          this.zoomedIn = !this.zoomedIn;
        });
      }, 500);
    }
  }

  onMoveEnd(event) {
    this.currentXPos = event.x;
    this.currentYPos = event.y;
    this.posX = event.x;
    this.posY = event.y;
    console.log('event.x:' + event.x + ' event.y:' + event.y);
    // let eventX = (this.originalLocationWidth + 0.5) * -1;
    // this.posX = eventX + (event.x * -1);
    // this.posX = (this.posX * -1 );
    // this.posY = event.y;
    // console.log('pos.x:' + this.posX + ' pos.y:' + this.posY);
    // if (!this.zoomedIn) {
      // this.calculateRealPostition();
    // }
  }

  checkEdge(event) {
    this.edge = event;
  }

  ionViewWillLeave() {
    if (this.inputField) {
      this.inputField.disabled = true;
    }
  }

  async ionViewWillEnter() {
    if (!await this.storage.get('loaderToShow')) {
      await this.service.showLoader();
    }
    this.storage.get('current_protocol').then((val) => {
      if (val) {
        this.currentProtocolId = val.id;
        this.currentProtocolName = val.name;
      }
    });
    this.storage.get('locations').then((locations) => {
      // this.locations = [];
      // Object.keys(locations).map(key => {
      //   this.locations.push(locations[key]);
      // });
        this.locations = locations;
    });

    this.showFilterList = false;
    this.TranslationService.getTranslations();
    this.request_data = await this.storage.get('request_data');

    this.all_components = await this.storage.get('all_components');
    const current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    this.partiesInfo = submit_data[current_index].parties;

    this.currentLocation = await this.storage.get('current_location');
    this.storage.get('action').then((actions) => {
      this.actions = Object.keys(actions).map(key => {
        return ({id: Number(key), label: actions[key]});
      });
    });

    this.storage.get('cost_impact').then((costImpacts) => {
      this.costImpacts = Object.keys(costImpacts).map(key => {
        return ({id: Number(key), label: costImpacts[key]});
      });
      const item = this.costImpacts.find(i => i.id === 3);
      const itemIndex = this.costImpacts.findIndex(i => i.id === 3);
      this.costImpacts.splice(itemIndex, 1);
      this.costImpacts.push(item);
    });
    if ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && submit_data[current_index].parties.unit_id != '') {
        this.storage.get('request_categories_p2').then((categories) => {
            Object.keys(categories).map(key => {
               this.request_categories.push(categories[key]);
            });
        });
    } else {
        this.storage.get('request_categories').then((categories) => {
            Object.keys(categories).map(key => {
                if (key === '2') {
                    this.request_categories.splice(1, 0, categories[key]);
                } else {
                    this.request_categories.push(categories[key]);
                }
            });
        });
    }

    // service provider filter
    if (this.requestInnerInfo.fieldId === 'service_provider') {
      this.fieldTitle = this.TranslationService.translationsList.offline_tool.placeholders.request.service_provider;
    
      switch (this.request_data.activeId) {
        case 2:
          this.filterListValue = this.request_data.deficiency.service_provider ;
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.filterListValue = this.request_data.deficiency.service_provider ;
          } else {
              this.filterListValue = this.request_data.re_cleaning.service_provider ;
          }
          break;
        case 4:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.filterListValue = this.request_data.open_issue.service_provider ;
          } else {
              this.filterListValue = this.request_data.non_existent.service_provider;
          }
          break;
        default:
          break;
      }
      this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.request.service_provider;
      this.listArr = await this.storage.get('service_providers');
      this.filteredListArr = this.listArr;
      this.filterId = 'id';
      this.filterName = 'full_name';
      await this.storage.set('filter_list_name', 'full_name');
      if (!!this.filterListValue) {
        this.listArr = this.filteredListArr.filter(item => item.id === this.filterListValue);
        const tempList = this.filteredListArr.filter(item => item.id !== this.filterListValue);
        this.listArr = this.listArr.concat(tempList);
      }
    }

    // protocol 1
    if (this.currentProtocolId === 1 || (this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='') {
        if (this.requestInnerInfo.component_id === 1 || this.requestInnerInfo.component_id === 3) {
            this.currentComponentName = this.TranslationService.translationsList.offline_tool.main_categories.deficiency;
        } else {
            this.currentComponentName = this.TranslationService.translationsList.offline_tool.main_categories.open_issue;
        }
    }

    // protocol 4
    if ((this.currentProtocolId === 4 || this.currentProtocolId === 5) || ((this.currentProtocolId === 1 || this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id !== '')) {
      this.currentRoomLength = submit_data[current_index].rooms.length;
      let active_room = submit_data[current_index].rooms.find(room => room.id == this.requestInnerInfo.id);
      this.currentRoomId = active_room.id;
      this.currentRoomName = active_room.name;
      this.room_components = active_room.components;
      this.currentComponentIndex = this.requestInnerInfo.component_id;
      if(this.currentProtocolId == 1) {
          if (this.requestInnerInfo.component_id === 1 || this.requestInnerInfo.component_id === 3) {
              this.currentComponentName = this.TranslationService.translationsList.offline_tool.main_categories.deficiency;
          } else {
              this.currentComponentName = this.TranslationService.translationsList.offline_tool.main_categories.open_issue;
          }
      } else {
       //   let active_component = this.room_components[this.currentComponentIndex];
          this.currentComponentName = this.room_components[this.currentComponentIndex].name;
      }
      this.currentComponentIndex = 0;

    }
    // filter
    if (this.requestInnerInfo.fieldId === 'location') {
        this.listArr = []
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.labels.area;

        if (this.currentLocation === null || typeof this.currentLocation === 'undefined') {
          this.filterListValue = '';
          
        }else{
          this.filterListValue = this.currentLocation.id;         
        }
        this.listHeader =  this.TranslationService.translationsList.offline_tool.labels.location;
        this.listArr = this.locations;
        this.filteredListArr = this.listArr;        
        this.filterId = 'id';
        this.filterName = 'name';
        if (!!this.filterListValue) {
            this.listArr = this.filteredListArr.filter(item => item.id === this.filterListValue);
            const tempList = this.filteredListArr.filter(item => item.id !== this.filterListValue);
            this.listArr = this.listArr.concat(tempList);
        }
          
        this.filteredListArr = [];
    }

    // Subcategory
    if (this.requestInnerInfo.fieldId === 'subcategory') {
        this.selectedSubCategoryId = await this.request_data.activeId;
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.labels.sub_category;  // "Subkategorie";
    }

    // Title
    if (this.requestInnerInfo.fieldId === 'Title') {
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.placeholders.request.title;

        switch (this.request_data.activeId) {
            case 2:
                this.title = this.request_data.deficiency.title ;
                break;
            case 1:
                this.title = this.request_data.normal_wear.title;
                break;
            case 3:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.title = this.request_data.deficiency.title ;
                } else {
                    this.title = this.request_data.re_cleaning.title;
                }
                break;
            case 4:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.title = this.request_data.open_issue.title ;
                } else {
                    this.title = this.request_data.non_existent.title;
                }
                break;
            default:
                break;
        }
    }


    // Description
    if (this.requestInnerInfo.fieldId === 'Description') {
        this.showSaveButton = true;
    }
    // if (this.requestInnerInfo.fieldId === 'Description') {
    //     this.fieldTitle = this.TranslationService.translationsList.offline_tool.placeholders.request.description;
    //     switch (this.request_data.activeId) {
    //         case 2:
    //             this.description = this.request_data.deficiency.description ;
    //             break;
    //         case 1:
    //             this.description = this.request_data.normal_wear.description;
    //             break;
    //         case 3:
    //             if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
    //                 this.description = this.request_data.deficiency.description ;
    //             } else {
    //                 this.description = this.request_data.re_cleaning.description;
    //             }
    //             break;
    //         case 4:
    //             if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
    //                 this.description = this.request_data.open_issue.description ;
    //             } else {
    //                 this.description = this.request_data.non_existent.description;
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // Marker
    if (this.requestInnerInfo.fieldId === 'Marker') {
        this.showSaveButton = true;
        switch (this.request_data.activeId) {
            case 2:
                this.planLocation = this.request_data.deficiency.plan_location;
                this.planId = this.request_data.deficiency.plan_id;
                break;
            case 1:
                this.planLocation = this.request_data.normal_wear.plan_location;
                this.planId = this.request_data.normal_wear.plan_id;
                break;
            case 3:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.planLocation = this.request_data.deficiency.plan_location;
                    this.planId = this.request_data.deficiency.plan_id;
                } else {
                    this.planLocation = this.request_data.re_cleaning.plan_location;
                    this.planId = this.request_data.re_cleaning.plan_id;
                }
                break;
            case 4:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.planLocation = this.request_data.open_issue.plan_location;
                    this.planId = this.request_data.open_issue.plan_id;
                } else {
                    this.planLocation = this.request_data.non_existent.plan_location;
                    this.planId = this.request_data.non_existent.plan_id;
                }
                break;
            default:
                break;
        }
    }

    // Action
    if (this.requestInnerInfo.fieldId === 'Action') {
        this.fieldTitle = this.TranslationService.translationsList.requests.action.label;
        switch (this.request_data.activeId) {
            case 2:
                this.actionprotocol = this.request_data.deficiency.actionprotocol ;
                this.actionprotocol1 = this.request_data.deficiency.actionprotocol ;
                break;
            case 3:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.actionprotocol =  this.request_data.deficiency.actionprotocol;
                    this.actionprotocol1 =  this.request_data.deficiency.actionprotocol;
                }
                break;
            default:
                break;
        }
    }

    // Costs to be paid by
    if (this.requestInnerInfo.fieldId === 'Costs to be paid by') {

        this.showSaveButton = true;
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.labels.cost_by;
        switch (this.request_data.activeId) {
            case 2:
                this.costbyprotocol = this.request_data.deficiency.costbyprotocol;
                this.costbyprotocol1 = this.request_data.deficiency.costbyprotocol;
                if (this.costbyprotocol === 3) {
                    this.sharedValue = this.request_data.deficiency.sharedValue ;
                    this.is_shared_cost = true;
                }
                break;
            case 3:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.costbyprotocol = this.request_data.deficiency.costbyprotocol ;
                    this.costbyprotocol1 = this.request_data.deficiency.costbyprotocol ;
                    if (this.costbyprotocol === 3) {
                        this.sharedValue = this.request_data.deficiency.sharedValue;
                        this.is_shared_cost = true;
                    }
                } else {
                    this.costbyprotocol = this.request_data.re_cleaning.costbyprotocol ;
                    this.costbyprotocol1 = this.request_data.re_cleaning.costbyprotocol ;
                    if (this.costbyprotocol === 3) {
                        this.sharedValue = this.request_data.re_cleaning.sharedValue;
                        this.is_shared_cost = true;
                    }
                }
                break;
            case 4:
                this.costbyprotocol = this.request_data.non_existent.costbyprotocol;
                this.costbyprotocol1 = this.request_data.non_existent.costbyprotocol;
                if (this.costbyprotocol === 3) {
                    this.sharedValue = this.request_data.non_existent.sharedValue;
                    this.is_shared_cost = true;
                }
                break;
            default:
                break;
        }
    }
    if(this.requestInnerInfo.fieldId == 'Title') {
        this.showSaveButton = true;
    }
    // Marker
    if (this.requestInnerInfo.fieldId === 'Marker') {
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.labels.location;
        if ((this.currentProtocolId == 1 || this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id == '') {
            const active_floor = submit_data[current_index].floors.find(floor => floor.id === this.requestInnerInfo.id);
            if (active_floor.hasOwnProperty('plan_id') && active_floor.hasOwnProperty('plan_full_url')) {
                this.locationUrl = active_floor.plan_full_url || null;
                this.planId = active_floor.plan_id;
                this.ispdf = this.locationUrl ? this.locationUrl.includes('pdf') : null;
            } else {
                this.locationUrl = null;
            }
        } else {
            if (this.currentProtocolId == 4 || this.currentProtocolId == 5) {
              const current_index = await this.storage.get('current_index');
              let submit_data = await this.storage.get('submit_data');
              let active_room = submit_data[current_index].rooms.find(room => room.id == this.requestInnerInfo.id);
              this.locationUrl = active_room.full_url;
              this.planId = active_room.plan_id;
              this.ispdf = !!active_room.full_url ? this.locationUrl.includes('pdf') : null;
            } else {
              await this.storage.get('latestPlan').then((latestPlan) => {
                if (!!latestPlan) {
                    this.locationUrl = latestPlan.full_url;
                    this.planId = latestPlan.plan_id;
                    this.ispdf = this.locationUrl ? this.locationUrl.includes('pdf') : null;
                }
              });
            } 
        }
        // let hideMarker = setTimeout(() => {
        //     let markerElement;
        //     if (this.request_data.activeId == 2) {
        //         markerElement = this.marker_deficiency;
        //     } else if (this.request_data.activeId == 1) {
        //         markerElement = this.marker_normal_wear;
        //     } else if (this.request_data.activeId == 3) {
        //         markerElement = this.marker_re_cleaning;
        //     } else if (this.request_data.activeId == 4) {
        //         markerElement = this.marker_non_existent;
        //     }

        //     if (markerElement != null) {
        //         let hammer = new window['Hammer'](markerElement.nativeElement);
        //         hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });
        //         hammer.on('pan', (ev) => {
        //             this.handleDrag(ev);
        //         });
        //         this.renderer.setElementStyle(markerElement.nativeElement, 'position', 'absolute');
        //         if (this.ispdf == false) {
        //             this.containerWidth = this.locationImg.nativeElement.width;
        //             this.containerHeight = this.locationImg.nativeElement.height;
        //             this.originalLocationWidth = this.locationImg.nativeElement.naturalWidth;
        //             this.originalLocationHeight = this.locationImg.nativeElement.naturalHeight;
        //             this.renderer.setElementStyle(this.locationContainer.nativeElement, 'width', this.containerWidth + 'px');
        //             this.renderer.setElementStyle(this.locationContainer.nativeElement, 'height', this.containerHeight + 'px');
        //             if (!this.planLocation || this.planLocation.length == 0) {
        //                 this.renderer.setElementStyle(markerElement.nativeElement, 'left', this.containerWidth / 2 + 'px');
        //                 this.renderer.setElementStyle(markerElement.nativeElement, 'top', this.containerHeight / 2 + 'px');
        //                 this.posX = this.containerWidth / 2;
        //                 this.posY = this.containerHeight / 2;
        //                 this.calculateRealPostition();
        //             } else {
        //                 this.calculateContainerPosition(markerElement);
        //             }
        //         } else {
        //             let locateContainer = document.getElementsByClassName("locateContainer");
        //             this.containerWidth = locateContainer[locateContainer.length - 1].clientWidth;
        //             this.containerHeight = locateContainer[locateContainer.length - 1].clientHeight;
        //             this.originalLocationWidth = 668.16;
        //             this.originalLocationHeight = 825.6;

        //             if (!this.planLocation || this.planLocation.length == 0) {
        //                 this.renderer.setElementStyle(markerElement.nativeElement, 'left', this.containerWidth / 2 + 'px');
        //                 this.renderer.setElementStyle(markerElement.nativeElement, 'top', this.containerHeight / 2 + 'px');
        //                 this.posX = this.containerWidth / 2;
        //                 this.posY = this.containerHeight / 2;
        //                 this.calculateRealPostition();
        //             } else {
        //                 this.calculateContainerPosition(markerElement);
        //             }
        //             this.panZoomConfig.zoomOnMouseWheel = false;
        //             let hammerZoom = new window['Hammer'](this.pdfViewer['element'].nativeElement);
        //             hammerZoom.get('pinch').set({
        //                 enable: true
        //             });
        //             hammerZoom.on('doubletap', (ev) => {

        //                 if (this.zoomedIn) {
        //                     this.panZoom.zoomOut();
        //                     let hideMarker = setTimeout(() => {
        //                         this.panZoom.panElementRef.nativeElement.style.transform = 'translate3d(0px, 0px, 0px)';
        //                     }, 200);
        //                 }
        //                 this.zoomedIn = !this.zoomedIn;
        //             });
        //         }
        //     }
        // }, 500);
    }

    // Image Gallery
    if (this.requestInnerInfo.fieldId === 'gallery') {
        this.fieldTitle = this.TranslationService.translationsList.offline_tool.labels.add_attachment; // 'Anhang hinzufugen';

        switch (this.request_data.activeId) {
            case 0:
                this.inspection_images = [];
                break;
            case 2:
                this.inspection_images = this.request_data.deficiency.inspection_images;
                break;
            case 1:
                this.inspection_images = this.request_data.normal_wear.inspection_images;
                break;
            case 3:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.inspection_images = this.request_data.deficiency.inspection_images;
                } else {
                    this.inspection_images = this.request_data.re_cleaning.inspection_images;
                }
                break;
            case 4:
                if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                    this.inspection_images = this.request_data.open_issue.inspection_images;
                } else {
                    this.inspection_images = this.request_data.non_existent.inspection_images;
                }
                break;
            default:
                break;

        }
    }

    this.showFilterList = true;
    // this.setPosition();
    // this.calculateContainerPosition();
    if (this.requestInnerInfo.fieldId !== 'Marker') {
        await this.service.hideLoader();
    }
    
    setTimeout(async () => {
        if (this.inputField) {
            this.inputField.disabled = false;
            await this.inputField.setFocus();
        }
    }, 500);
  }

  ionViewDidLeave() {
      this.request_categories = [];

      // if (!!this.locationContainer) {
    //   this.renderer.setElementStyle(this.locationContainer.nativeElement, 'width', 100 + '%');
    //   this.renderer.setElementStyle(this.locationContainer.nativeElement, 'height', 592 + 'px');
    // }
  }

  // handleDrag(ev) {
  //   let leftPos;
  //   let topPos;
  //   leftPos = this.ispdf == true ? this.containerWidth - 24 : this.locationImg.nativeElement.width - 17;
  //   topPos = this.ispdf == true ? this.containerHeight - 29 : this.locationImg.nativeElement.height - 28;
  //   var markerElem = ev.target;
  //   if (!this.isDragging) {
  //     this.isDragging = true;
  //     this.lastPosX = markerElem.offsetLeft;
  //     this.lastPosY = markerElem.offsetTop;
  //   }
  //   let posX = ev.deltaX + this.lastPosX;
  //   let posY = ev.deltaY + this.lastPosY;
  //   if (posY >= 0 && posY <= topPos) {
  //     if (posX >= 0 && posX <= leftPos) {
  //       this.domCtrl.write(() => {
  //         this.posX = posX;
  //         this.posY = posY;

  //         this.renderer.setElementStyle(markerElem, 'left', this.posX + 'px');
  //         this.renderer.setElementStyle(markerElem, 'top', this.posY + 'px');
  //       });
  //     }
  //   }
  //   if (ev.isFinal) {
  //     this.calculateRealPostition();
  //     this.isDragging = false;
  //   }
  // }

  calculateRealPostition(tempPosX, tempPosY) {
    let splitScale = this.panZoom.zoomElementRef.nativeElement.style.transform.split("scale(");
    this.pdfScale = splitScale[1].split(")")[0];
    let dynamicPdfWidth = this.originalLocationWidth * this.pdfScale;
    let dynamicPdfHeight = this.originalLocationHeight * this.pdfScale;
    if (Math.sign(this.panX) == 1) {
      let boundryXpos = this.posX - this.panX;
      if (boundryXpos < 23 ){
        console.log("out of bound");
        this.panZoom.resetView();
      }
    } 
    if (Math.sign(this.panX) == -1) {
      let boundryXpos = this.posX - (dynamicPdfWidth + this.panX);
      if (boundryXpos > 7 ){
        console.log("out of bound");
        this.panZoom.resetView();
      }
    }
    if (Math.sign(this.panY) == 1) {
      let boundryYpos = this.posY - this.panY;
      if (boundryYpos < -4 ){
        console.log("out of bound");
        this.panZoom.resetView();
      }
    }
    if (Math.sign(this.panY) == -1) {
      let boundryYpos = this.posY - (dynamicPdfHeight + this.panY);
      if (boundryYpos > -26 ){
        console.log("out of bound");
        this.panZoom.resetView();
      }
    }
    let originalPdfPosX = (this.originalLocationWidth * tempPosX ) / (dynamicPdfWidth);
    let originalPdfPosY = (this.originalLocationHeight * tempPosY ) / (dynamicPdfHeight);
    let posX = (1100 * originalPdfPosX) / this.originalLocationWidth;
    posX = (posX - 40) + 5;
    if (this.zoomedIn) {
      posX = posX + 7.78;
    }
    let posY = (this.mainContainerHeight  * originalPdfPosY) / this.originalLocationHeight;
    posY = posY - 12;
    console.log('real.x:' + posX + ' real.y:' + posY);
    this.planLocation = [{ x: posX, y: posY }];
  }
  calculateContainerPosition() {
    if (this.ispdf && this.containerWidth) {
        let dynamicPdfWidth = this.originalLocationWidth * this.pdfScale;
        let dynamicPdfHeight = this.originalLocationHeight * this.pdfScale;
        let posX = ((dynamicPdfWidth) * this.planLocation[0].x) / 1100;
        posX = (posX + 33.83);
        let posY = ((dynamicPdfHeight) * this.planLocation[0].y) / this.mainContainerHeight;
        posY = posY + 12;
        console.log("containerX = "+ posX +"containerY=" + posY);
        this.panX = this.posX - posX;
        this.panY = this.posY - posY;
        console.log("panX = "+ this.panX +"panY=" + this.panY);
        let point = { x: this.panX * -1, y: this.panY * -1};
        this.panZoom.panDeltaAbsolute(point, [1]);
    }
  }

  closeMarkerSlide() {
    this.openMarkerSlide = false;
    if (this.zoomedIn) {
      this.zoomedIn = false;
      this.panZoom.zoomOut();
    }
  }

  openCam(category) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.inspection_images.push({ img: this.image });

    }, (err) => {
      alert('error ' + JSON.stringify(err));
    });
  }

  async displaySharedInput(id) {
    const oldcostbyprotocol =  await this.storage.get('costbyprotocol');
    if (oldcostbyprotocol == id){
        await this.storage.set('costbyprotocol', '');
        this.is_shared_cost = false;
        this.goToRequestPage();
    } else {
        await this.storage.set('costbyprotocol', id);
        if (this.costbyprotocol === 3) {
            this.is_shared_cost = true;
            setTimeout(() => {
                this.inputField.setFocus();
            }, 200);
        } else {
            this.is_shared_cost = false;
            this.goToRequestPage();
        }
    }
  }

  checkSubCategory(index) {

      if((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id != '') {
          index = parseInt(index) + 2;
      } else {
          if (index === 1) {
              index = 2;
          } else if (index === 2) {
              index = 1;
          }
      }

    let checked:boolean = false;
    checked = index === this.request_data.activeId ? true : false;
    return checked;
  }

  checkAction(index) {
    let checked:boolean = false;
    switch (this.request_data.activeId) {
      case 2:
        checked = (index === this.request_data.deficiency.actionprotocol) ? true : false;
        break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              checked = (index === this.request_data.deficiency.actionprotocol) ? true : false;
          }
          break;
    }
    return checked;
  }
    async checkActionValue(id) {
        this.costbyprotocol1 = id;
        await this.storage.set('actionprotocol', id);
        setTimeout(() => {
            this.goToRequestPage();
        }, 100);
    }

  async uncheckCost(id) {
    if (id === 3) {
      this.is_shared_cost = false;
    }
    this.costbyprotocol = '';
    this.costbyprotocol1 = '';
    await this.storage.set('costbyprotocol', '');
    setTimeout(() => {
        this.goToRequestPage();
    }, 100);
  }
  async uncheckAction(id) {
      await this.storage.set('actionprotocol', '');
      setTimeout(() => {
          this.goToRequestPage();
      }, 100);
  }
  checkCostImact(index) {
    let checked:boolean = false;
    switch (this.request_data.activeId) {
      case 2:
        checked = index === this.request_data.deficiency.costbyprotocol ? true : false;
        break;
      case 3:
        if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            checked = index === this.request_data.deficiency.costbyprotocol ? true : false;
        } else {
            checked = index === this.request_data.re_cleaning.costbyprotocol ? true : false;
        }
        break;
      case 4:
        checked = index === this.request_data.non_existent.costbyprotocol ? true : false;
        break;
    }
    return checked;
  }

  async openModal(url) {
    const modalProps = { url: url};
    const modal =
      await this.modal.create({
        component: ImagePopupPage,
        componentProps: {data: modalProps}
      });
    await modal.present();
  }

  async goToRequestPage() {
    const msgWait = this.TranslationService.translationsList.offline_tool.messages.please_wait;
    const loading = await this.loadingController.create({
      message: msgWait,
      duration: 500
    });
    // await loading.present();

      const current_index = await this.storage.get('current_index');
      let submit_data = await this.storage.get('submit_data');

    if (this.requestInnerInfo.fieldId === 'subcategory') {
      this.fieldValue = (typeof this.selectedSubCategoryId ) !== 'undefined' && this.selectedSubCategoryId != this.request_data.activeId ? this.selectedSubCategoryId : this.request_data.activeId;

      if((this.currentProtocolId == 2 || this.currentProtocolId == 3) && submit_data[current_index].parties.unit_id != '') {
          this.request_data.activeId = parseInt(this.fieldValue) + 2;
      } else {
          this.request_data.activeId = this.fieldValue / 1;
      }
    }

    if (this.requestInnerInfo.fieldId == 'Title'){
      let isEmptyTitle = false;
        if (this.title == null || this.title === '' || typeof(this.title) === 'undefined') {
            isEmptyTitle = true;
        }
      switch(this.request_data.activeId){
        case 2:
          this.request_data.deficiency.title = this.title !== '' ? this.title : this.request_data.deficiency.title;
          break;
        case 1:
          this.request_data.normal_wear.title = this.title !== '' ? this.title : this.request_data.normal_wear.title;
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            this.request_data.deficiency.title = this.title !== '' ? this.title : this.request_data.deficiency.title;
          } else {
            this.request_data.re_cleaning.title = this.title !== '' ? this.title : this.request_data.re_cleaning.title;
          }
          break;
        case 4:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
            this.request_data.open_issue.title = this.title !== '' ? this.title : this.request_data.open_issue.title;
          } else {
            this.request_data.non_existent.title = this.title !== '' ? this.title : this.request_data.non_existent.title;
          }
          break;
        default:
          break;
      }
        if (isEmptyTitle === true) {
            this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
            return;
        }
    }

    if (this.requestInnerInfo.fieldId === 'Description') {
      switch (this.request_data.activeId) {
        case 2:
          this.request_data.deficiency.description = this.description !== '' ? this.description : this.request_data.description.description;
          break;
        case 1:
          this.request_data.normal_wear.description = this.description !== '' ? this.description : this.request_data.normal_wear.description;
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.deficiency.description = this.description !== '' ? this.description : this.request_data.deficiency.description;
          } else {
              this.request_data.re_cleaning.description = this.description !== '' ? this.description : this.request_data.re_cleaning.description;
          }
          break;
        case 4:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.open_issue.description = this.description !== '' ? this.description : this.request_data.open_issue.description;
          } else {
              this.request_data.non_existent.description = this.description !== '' ? this.description : this.request_data.non_existent.description;
          }
          break;
        default:
          break;
      }
    }
    // Marker
    if(this.requestInnerInfo.fieldId == 'Marker'){
      switch(this.request_data.activeId){
        case 2:
          this.request_data.deficiency.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.deficiency.plan_location;
          this.request_data.deficiency.plan_id = this.planId;
          break;
        case 1:
          this.request_data.normal_wear.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.normal_wear.plan_location;
          this.request_data.normal_wear.plan_id = this.planId;
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.deficiency.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.deficiency.plan_location;
              this.request_data.deficiency.plan_id = this.planId;
          } else {
              this.request_data.re_cleaning.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.re_cleaning.plan_location;
              this.request_data.re_cleaning.plan_id = this.planId;
          }
          break;
        case 4:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.open_issue.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.open_issue.plan_location;
              this.request_data.open_issue.plan_id = this.planId;
          } else {
              this.request_data.non_existent.plan_location = this.planLocation.length > 0 ? this.planLocation : this.request_data.non_existent.plan_location;
              this.request_data.non_existent.plan_id = this.planId;
          }
          break;
        default:
          break;
      }
    }
    if (this.requestInnerInfo.fieldId === 'service_provider') {
      this.fieldValue = await this.storage.get('filter_list_value');
      switch (this.request_data.activeId) {
        case 2:
          this.request_data.deficiency.service_provider = this.fieldValue;
          break;
        case 1:
          this.request_data.normal_wear.service_provider = this.fieldValue;
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.deficiency.service_provider = this.fieldValue;
          } else {
              this.request_data.re_cleaning.service_provider = this.fieldValue;
          }
          break;
        case 4:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              this.request_data.open_issue.service_provider = this.fieldValue;
          } else {
              this.request_data.non_existent.service_provider = this.fieldValue;
          }
          break;
        default:
          break;
      }
    }

    if (this.requestInnerInfo.fieldId === 'location') {
      this.fieldValue = await this.storage.get('filter_list_value');
      this.currentLocation = this.locations.filter(location => location.id === this.fieldValue)[0];
    }

    if (this.requestInnerInfo.fieldId === 'Action') {
      const actionprotocol = await this.storage.get('actionprotocol');
      this.fieldValue = actionprotocol;

      switch (this.request_data.activeId) {
        case 2:
          if (this.fieldValue != '') {
              this.request_data.deficiency.actionprotocol = this.fieldValue / 1;
          } else {
              this.request_data.deficiency.actionprotocol = this.fieldValue;
          }
          break;
        case 3:
          if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
              if (this.fieldValue != '') {
                  this.request_data.deficiency.actionprotocol = this.fieldValue / 1;
              } else {
                  this.request_data.deficiency.actionprotocol = this.fieldValue;
              }
          }
          break;
        default:
          break;
      }
    }

    // Costs to be paid by
    if (this.requestInnerInfo.fieldId === 'Costs to be paid by') {
      let isEmpty = false;
      const costbyprotocol = await this.storage.get('costbyprotocol');
      switch (this.request_data.activeId) {
        case 2:
          this.request_data.deficiency.costbyprotocol = costbyprotocol;
          if (costbyprotocol === 3) {
            this.request_data.deficiency.sharedValue = this.sharedValue;
            if (this.sharedValue == null || typeof(this.sharedValue) === 'undefined') {
              isEmpty = true;
            }
          }else{
            this.request_data.deficiency.sharedValue = 0;
          }
          break;
        case 3:
            if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                this.request_data.deficiency.costbyprotocol = costbyprotocol;
                if (costbyprotocol === 3) {
                    this.request_data.deficiency.sharedValue = this.sharedValue;
                    if (this.sharedValue == null || typeof(this.sharedValue) === 'undefined') {
                        isEmpty = true;
                    }
                }
                else{
                  this.request_data.deficiency.sharedValue = 0;
                }
            } else {
                this.request_data.re_cleaning.costbyprotocol = costbyprotocol;
                if (costbyprotocol === 3) {
                    this.request_data.re_cleaning.sharedValue = this.sharedValue;
                    if (this.sharedValue == null || typeof(this.sharedValue) === 'undefined') {
                        isEmpty = true;
                    }
                }
                else{
                  this.request_data.re_cleaning.sharedValue = 0;
                }

            }
            break;
        case 4:
            this.request_data.non_existent.costbyprotocol = costbyprotocol;
            if (costbyprotocol === 3) {
                this.request_data.non_existent.sharedValue = this.sharedValue;
                if (this.sharedValue == null || typeof(this.sharedValue) === 'undefined') {
                    isEmpty = true;
                }
            }
            else{
                this.request_data.non_existent.sharedValue = 0;
            }
            break;
        default:
          break;
      }
      if (isEmpty === true) {
        this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
        return;
      }
      isEmpty = false;
    }

    if (this.request_data.filterId === 'gallery') {
      switch (this.request_data.activeId) {
        case 0:
          this.inspection_images = [];
          break;
        case 2:
          this.request_data.deficiency.inspection_images = this.inspection_images;
          break;
        case 1:
          this.request_data.normal_wear.inspection_images = this.inspection_images;
          break;
        case 3:
            if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                this.request_data.deficiency.inspection_images = this.inspection_images;
            } else {
                this.request_data.re_cleaning.inspection_images = this.inspection_images;
            }
            break;
        case 4:
            if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id=='')) {
                this.request_data.open_issue.inspection_images = this.inspection_images;
            } else {
                this.request_data.non_existent.inspection_images = this.inspection_images;
            }
            break;
        default:
          break;
      }
      this.inspection_images = [];
    }
    this.request_data.isUpdated = true;

    await this.storage.set('request_data', this.request_data);

      if (this.requestInnerInfo.fieldId === 'location') {
        await this.storage.set('current_location', this.currentLocation);
    }
// return
    const navigationExtras: NavigationExtras = {
      queryParams: {
        requestInfo: JSON.stringify({
          id: this.requestInnerInfo.id,
          component_id: this.requestInnerInfo.component_id,
          fieldId: this.requestInnerInfo.fieldId,
        })
      }
    };

    this.request_categories = [];
    this.costImpacts = [];
    this.actions = [];
    this.is_shared_cost = false;
    this.sharedValue = 0;
    this.costbyprotocol = 1;
    this.listArr = [];
    this.filteredListArr = [];
    this.router.navigate(['/request'], navigationExtras);
  }

  checkGoBackToRequestPage() {
      if (this.requestInnerInfo.fieldId == 'Title' && this.title.trim() != '') {
          this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
              this.goBackToRequestPage();
          });
      } else {
          this.goBackToRequestPage();
      }
  }
  goBackToRequestPage() {
      const navigationExtras: NavigationExtras = {
          queryParams: {
              requestInfo: JSON.stringify({
                  id: this.requestInnerInfo.id,
                  component_id: this.requestInnerInfo.component_id,
                  fieldId: this.requestInnerInfo.fieldId,
              })
          }
      };

      this.request_categories = [];
      this.costImpacts = [];
      this.actions = [];
      this.is_shared_cost = false;
      this.sharedValue = 0;
      this.costbyprotocol = 1;
      this.listArr = [];
      this.filteredListArr = [];
      this.router.navigate(['/request'], navigationExtras);
  }
}
