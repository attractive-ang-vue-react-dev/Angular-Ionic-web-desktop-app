import { Component, OnInit, ViewChild, Renderer} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController, IonContent, DomController } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../api/translation.service';
import { ObservableService } from '../api/observable.service';
@Component({
  selector: 'app-room-object',
  templateUrl: './room-object.page.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
  styleUrls: ['./room-object.page.scss'],
})
export class RoomObjectPage implements OnInit {
  @ViewChild(IonContent, { 'static': false }) content: IonContent;
  headerbackTitle:string;
  headerTitle:string;
  activeCategoryID: any = 0;
  image: any = ''
  /*all_components: any;*/
  goToNextRoom: any = true;
  currentComponentIndex: any;
  deficiency: any = { 'title': '', 'description': '', service_providers: [], 'service_provider': null, 'actionprotocol': '', 'costbyprotocol': '', 'sharedValue': '', 'plan_location': [], 'plan_id': '', 'inspection_images': [] };
  normal_wear: any = { 'title': '', 'description': '', 'plan_location': [], 'plan_id': '', 'inspection_images': [] };
  re_cleaning: any = { 'title': '', 'description': '', service_providers: [], 'service_provider': null, 'costbyprotocol': '', 'plan_location': [], 'plan_id': '', 'sharedValue': '', 'inspection_images': '' };
  non_existent: any = { 'title': '', 'description': '', service_providers: [], 'service_provider': '', 'costbyprotocol': '', 'plan_location': [], 'plan_id': '', 'sharedValue': '', 'inspection_images': '' };
  open_issue: any = { 'title': '', 'description': '', service_providers: [], 'service_provider': '', 'costbyprotocol': '', 'plan_location': [], 'plan_id': '', 'sharedValue': '', 'inspection_images': '' };
  currentComponentName: any;
  costbyprotocol: any;
  actionprotocol: any;
  roomIdObj: any;
  room_components: any = [];
  rooms: any = [];
  currentProtocolName: any;
  currentProtocolId: any;
  sharedValue: any;
  currentSwipe: any;
  service_providers: any = [];
  request_categories: any = [];
  locations: any = [];
  current_index: any;
  currentRoomLength: any;
  currentRoomId: any;
  currentFloorLength: any;
  currentFloorId: any;
  currentRequests: any;
  partiesInfo: any;
  floors: any = [];
  isNextRoomBtn: any = true;
  needToShow = false;
  markLoader: boolean = false;
  nextRoomLoader: boolean = false;
  showMarkBtn: boolean = false;

  constructor(
    private storage: Storage,
    public loadingController: LoadingController,
    private router: Router,
    public service: SimpleService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public renderer: Renderer,
    public domCtrl: DomController,
    public TranslationService: TranslationService,
    public observableService: ObservableService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.roomInfo) {
        this.roomIdObj = JSON.parse(params.roomInfo);
      }
    });
  }

  markOkay(componentIndex, item) {
    this.gofurther(componentIndex, 0);
    this.rarely(item);
  }

  checkForSide(component, data) {
    this.needToShow = data.target.className.search('item-sliding-active-options-end') !== -1;
    if (this.needToShow === true) {
      this.currentSwipe = component;
    } else {
      this.currentSwipe = null;
    }
  }

  async ionViewWillEnter() {
    if (!await this.storage.get('loaderToShow')) {
      await this.service.showLoader();
    }
    this.showMarkBtn = false;
    await this.TranslationService.getTranslations();
    await this.storage.set('currentSelectedRequestId', '');

    const currentProtocol = await this.storage.get('current_protocol');

    this.currentProtocolId = currentProtocol.id;
    this.currentProtocolName = currentProtocol.name;


    var current_index = await this.storage.get('current_index');
    var submit_data = await this.storage.get('submit_data');
    this.partiesInfo = submit_data[current_index].parties;

      if (this.currentProtocolId === 1  || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id == '')) {
          this.request_categories = await this.storage.get('main_categories');
      } else {
          this.storage.get('request_categories').then((categories) => {
              this.request_categories = [];
              Object.keys(categories).map(key => {
                  this.request_categories.push(categories[key]);
              });
          });
      }

      this.storage.get('locations').then((locations) => {
          Object.keys(locations).map(key => {
              this.locations.push(locations[key]);
          });
      });

    if (this.currentProtocolId === 1 || ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id == '')) {
        this.initFloor(submit_data, current_index);
    } else {
        this.initRoom(submit_data, current_index);
    }
    this.currentComponentIndex = 0;
    
    if ((this.currentProtocolId==4 || this.currentProtocolId==5) || ((this.currentProtocolId==1 || this.currentProtocolId==2 || this.currentProtocolId==3) && this.partiesInfo && this.partiesInfo.unit_id != '')) {
      this.headerbackTitle = 'offline_tool.navigations.rooms';
    }
    if (((this.currentProtocolId==1 || this.currentProtocolId==2 || this.currentProtocolId==3) && this.partiesInfo && this.partiesInfo.unit_id == '')) {
      this.headerbackTitle = 'offline_tool.labels.floors';
    }
    this.getHeaderTitle();
    
  }

  ionViewDidLeave() {  
  }

  ngOnInit() {
    // this.initRoom();
  }

  async initRoom(submit_data, current_index) {
    this.rooms = await this.storage.get('rooms');

    /*this.all_components = await this.storage.get('all_components');*/
    this.currentRoomLength = submit_data[current_index].rooms.length;

    let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);
    this.room_components = active_room.components;
    this.currentRoomId = active_room.id;
    this.isNextRoomBtn = false;
    this.nextRoomLoader = false;
    let showBtns = true;
    if (submit_data[current_index].rooms[this.currentRoomLength - 1].id == this.currentRoomId) {
      showBtns = false;
    }

   /* let noOfRooms = submit_data[current_index].rooms;*/
      this.currentRoomId = submit_data[current_index].rooms.findIndex(item => item.id == this.roomIdObj.id);
/*    for (let index = 0; index < noOfRooms.length; index++) {
      if(noOfRooms[index].id == this.roomIdObj.id){
        this.currentRoomId = index;
      }

    }*/

    if (active_room.components == null || active_room.components.length == 0) {
      // active_room.components = this.all_components.filter(item => {
      //   return active_room.component_ids.includes(item.id);
      // });

     // active_room.components.map(comp => comp.complete = false);
      active_room.complete_count = 0;
    }
    await this.service.hideLoader();
    setTimeout(() => {
        this.goToNextRoom = true;
        this.showMarkBtn = true;
        if (active_room.complete) this.goToNextRoom = false;
        if (showBtns) {
            this.isNextRoomBtn = true;
        } else {
            this.isNextRoomBtn = false;
        }
    }, 500);
  }
  async initFloor(submit_data, current_index) {
    let active_floor: any;
   /* this.all_components = await this.storage.get('all_components');*/
    if (this.partiesInfo.unit_id !== '') {
        this.floors = await this.storage.get('rooms');
        this.currentFloorLength = submit_data[current_index].rooms.length;
        active_floor = submit_data[current_index].rooms.find(room => room.id === this.roomIdObj.id);
        this.currentFloorId = active_floor.id;
        if (submit_data[current_index].rooms[this.currentFloorLength - 1].id === this.currentFloorId) {
            this.isNextRoomBtn = false;
        }
        /*const noOfFloors = submit_data[current_index].rooms;
        for (let index = 0; index < noOfFloors.length; index++) {
            if (noOfFloors[index].id === this.roomIdObj.id) {
                this.currentFloorId = index;
            }
        }*/
        this.currentFloorId = submit_data[current_index].rooms.findIndex(item => item.id == this.roomIdObj.id);
        if (submit_data[current_index].rooms[this.currentFloorId].request) {
            this.currentRequests = submit_data[current_index].rooms[this.currentFloorId].request;
            /*let currentRequests = submit_data[current_index].rooms[this.currentFloorId].request;
            this.currentRequests = currentRequests.filter((req) => {
                if (req.complete) {
                    req.complete = req.complete;
                } else {
                    req.complete = false;
                }
                return req;
            });
            this.currentRequests.sort((a, b) => {
                return b.complete - a.complete;
            });
            submit_data[current_index].rooms[this.currentFloorId].request = this.currentRequests;
            this.storage.set('submit_data', submit_data);*/
        }
    } else {
        this.floors = await this.storage.get('floors');
        this.currentFloorLength = submit_data[current_index].floors.length;
        active_floor = submit_data[current_index].floors.find(floor => floor.id === this.roomIdObj.id);
        this.currentFloorId = active_floor.id;
        if (submit_data[current_index].floors[this.currentFloorLength - 1].id === this.currentFloorId) {
            this.isNextRoomBtn = false;
        }
        /*const noOfFloors = submit_data[current_index].floors;
        for (let index = 0; index < noOfFloors.length; index++) {
            if (noOfFloors[index].id === this.roomIdObj.id) {
                this.currentFloorId = index;
            }
        }*/
        this.currentFloorId = submit_data[current_index].floors.findIndex(item => item.id == this.roomIdObj.id);
        if (submit_data[current_index].floors[this.currentFloorId].request) {
            this.currentRequests = submit_data[current_index].floors[this.currentFloorId].request;
            /*let currentRequests = submit_data[current_index].floors[this.currentFloorId].request;
            this.currentRequests = currentRequests.filter((req) => {
                if (req.complete) {
                    req.complete = req.complete;
                } else {
                    req.complete = false;
                }
                return req;
            });
            this.currentRequests.sort((a, b) => {
                return b.complete - a.complete;
            });
            submit_data[current_index].floors[this.currentFloorId].request = this.currentRequests;
            this.storage.set('submit_data', submit_data);*/
        }
    }

    if (active_floor.complete){
      this.goToNextRoom = false;
    }

    this.service.hideLoader();
  }

  //for outside click event
  onClick(event) {
  }

  rarely(item) {
    item.close();
  }
  getLocationName(id) {
      return this.locations.filter(loc => loc.id === id)[0].name;
  }
  async gofurther(componentIndex, request_category) {
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
      let active_component = this.room_components[componentIndex];
      this.currentComponentName = active_component.name;
      active_component.category_id = request_category;
      active_component.complete = true;

      if (componentIndex == this.room_components.length - 1) {
        // this.openslider = false;
      } else {
        this.currentComponentIndex++;
      }
      this.currentComponentName = this.room_components[this.currentComponentIndex].name;
      let request = {};


      var current_index = await this.storage.get('current_index');
      var submit_data = await this.storage.get('submit_data');
      
      let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);

      if (active_room.components == null) {
        active_room.components = [];
      }

      //let savingComponent = active_room.components.find(item => item.id === active_component.id);
      const savingComponent = active_component;
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

      this.goToNextRoom = true;
      if (active_room.complete) this.goToNextRoom = false;

      this.currentComponentIndex = active_room.complete_count;
      await this.storage.set('submit_data', submit_data);
      await this.service.updateRooms(this.roomIdObj.id);

      setTimeout(() => {
        this.activeCategoryID = 0;
      }, 500);
      this.service.hideLoader();

  }

  async gofurtherRequest(componentIndex, request_category) {
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
      this.currentRequests[componentIndex].complete = true;

      var current_index = await this.storage.get('current_index');
      var submit_data = await this.storage.get('submit_data');

      this.currentRequests.sort((a, b) => {
        return b.complete - a.complete;
      });

      submit_data[current_index].floors[this.currentFloorId].request = this.currentRequests;
      await this.storage.set('submit_data', submit_data);

      setTimeout(() => {
        this.activeCategoryID = 0;
      }, 500);
      this.service.hideLoader();


  }
  async goToRoom() {
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
    this.router.navigate(['/rooms']);
    /*setTimeout(() => {
      this.service.hideLoader();
    }, 500);*/
  }

 /* async addNewComponent(Header) {
    const placeholderNewComponent = this.TranslationService.translationsList.offline_tool.placeholders.enter_new_component_name;
    const btnLabelCancel = this.TranslationService.translationsList.offline_tool.labels.cancel;
    const btnLabelSave = this.TranslationService.translationsList.offline_tool.labels.save;
    const alert = await this.alertController.create({
      header: Header,
      inputs: [
        {
          name: 'Component',
          type: 'text',
          placeholder: placeholderNewComponent
        }],
      buttons: [
        {
          text: btnLabelCancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: btnLabelSave,
          handler: async (alertData) => {
            console.log('Confirm Okay');
            const current_index = await this.storage.get('current_index');
            var submit_data = await this.storage.get('submit_data');
            const new_component_count = submit_data[current_index].new_component_count ? submit_data[current_index].new_component_count : 0;
            const componentID = 9999 + new_component_count;

            var new_component = {
              'id': componentID,
              'name': alertData.Component,
              'unique_number': "BA" + componentID,
              'complete': false,
              'checked': false
            };

            if (alertData.Component) {
              this.all_components.push(new_component);
              this.room_components.push(new_component);
              for (let g = 0; g < this.all_components.length; g++) {
                if (this.all_components[g].checked) {
                  this.all_components[g].checked = false;
                }
              }
              this.storage.set('all_components', this.all_components);

              let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);
              active_room.components = this.room_components;
              active_room.component_ids.push(componentID);
              active_room.components_count++;
              if (active_room.complete_count == active_room.components_count) {
                active_room.complete = true;
              } else {
                active_room.complete = false;
              }

              if (submit_data[current_index].new_component_count == null) {
                submit_data[current_index].new_component_count = 0;
              }
              submit_data[current_index].new_component_count = new_component_count + 1;

              this.storage.set('submit_data', submit_data);
            }
          }
        }
      ]
    });

    await alert.present();
  }*/

  async addNewComponent() {
    await this.storage.set('filter_list_name', 'add_component');
    await this.storage.set('filter_list_value', '');
      await this.storage.set('roomIdObj', this.roomIdObj);
      this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
      let navigationExtras: NavigationExtras = {
          queryParams: {
              roomInfo: JSON.stringify(this.roomIdObj)
          }
      }
     /* setTimeout(() => {
        this.service.hideLoader();
      }, 300);*/
      this.router.navigate(['/add-component'], navigationExtras);
  }

  async clearComponent(compID,index){
    this.room_components.splice(index, 1);
    const current_index = await this.storage.get('current_index');
    var submit_data = await this.storage.get('submit_data');
    
    let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);
    active_room.components = this.room_components;
    // for (let index = 0; index < active_room.component_ids.length; index++) {
    //   if(active_room.component_ids[index] == compID){
    //     active_room.component_ids.splice(index, 1);
    //     break;
    //   }
    // }
    // active_room.component_ids = active_room.component_ids.filter(id => id != compID);
    active_room.components_count --;
    active_room.complete_count = active_room.components.filter(item => item.complete == true).length;
    active_room.complete = false;
    if (active_room.complete_count == active_room.components_count) {
      active_room.complete = true;
    }
    this.goToNextRoom = true;
    if (active_room.complete) this.goToNextRoom = false;

    await this.storage.set('submit_data', submit_data);
    await this.service.updateRooms(this.roomIdObj.id);
  }

  async markAll() {
    this.markLoader = true;
    this.observableService.isRoomsChanged = true;
    for (let index = 0; index < this.room_components.length; index++) {
      if (this.room_components[index].complete == false) {
        this.room_components[index].complete = true;
        this.room_components[index]['category_id'] = 0;
        this.room_components[index]['category_id'] = 0;
        this.room_components[index]['request'] = {};
      }
    }
    let current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');

    let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);
    active_room.components = this.room_components;
    active_room.complete_count = active_room.components_count;
    active_room.complete = true;

    await this.storage.set('submit_data', submit_data);
    await this.service.updateRooms(this.roomIdObj.id);
    this.goToNextRoom = false;
    this.markLoader = false;
  }

  async goToNextRoomInspection() {
    let current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    this.roomIdObj.id = submit_data[current_index].rooms[this.currentRoomId+1].id;
    this.roomIdObj.room_name = submit_data[current_index].rooms[this.currentRoomId+1].name;
    this.getHeaderTitle();
    this.goToNextRoom = true;
    this.initRoom(submit_data, current_index);
  }
  getHeaderTitle() {
    if ((this.currentProtocolId!=1 && this.currentProtocolId!=2 && this.currentProtocolId!=3) || ((this.currentProtocolId==1 || this.currentProtocolId==2 || this.currentProtocolId==3) && this.partiesInfo && this.partiesInfo.unit_id !== '')) {
      if (this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.rooms, this.roomIdObj.room_name)) {
        this.headerTitle = 'rooms.'+ this.roomIdObj.room_name;
      } else {
        this.headerTitle = this.roomIdObj.room_name;
      }
    }
    if (((this.currentProtocolId==1 || this.currentProtocolId==2 || this.currentProtocolId==3) && this.partiesInfo && this.partiesInfo.unit_id == '')) {
      if (this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.floors, this.roomIdObj.room_name)) {
        this.headerTitle = 'floors.'+ this.roomIdObj.room_name;
      } else {
        this.headerTitle = this.roomIdObj.room_name;
      }
    }
  }

  async duplicateComponent(comp, index) {
    let current_index = await this.storage.get('current_index');
    let submit_data = await this.storage.get('submit_data');
    let active_room_index = submit_data[current_index].rooms.findIndex(room => room.id == this.roomIdObj.id);
    submit_data[current_index].rooms[active_room_index].components.splice(index + 1, 0, comp);
    submit_data[current_index].rooms[active_room_index].components_count ++;
    let complete_count = submit_data[current_index].rooms[active_room_index].components.filter(item => item.complete == true).length;
    submit_data[current_index].rooms[active_room_index].complete_count  = complete_count;
    submit_data[current_index].rooms[active_room_index].complete = false;
    if (submit_data[current_index].rooms[active_room_index].complete_count == submit_data[current_index].rooms[active_room_index].components_count) {
      submit_data[current_index].rooms[active_room_index].complete = true;
    }
    this.goToNextRoom = true;
    if (submit_data[current_index].rooms[active_room_index].complete) this.goToNextRoom = false;

    this.room_components = submit_data[current_index].rooms[active_room_index].components;
    await this.storage.set('submit_data', submit_data);
    await this.service.updateRooms(this.roomIdObj.id);
  }

  async duplicateRequest(comp, index) {
    const currentIndex = await this.storage.get('current_index');
    let submitData: any;
    submitData = await this.storage.get('submit_data');
    if (this.partiesInfo.unit_id !== '') {
        const activeFloorIndex = submitData[currentIndex].rooms.findIndex(room => room.id === this.roomIdObj.id);
        submitData[currentIndex].rooms[activeFloorIndex].request.splice(index + 1, 0, comp);
        this.currentRequests = submitData[currentIndex].rooms[activeFloorIndex].request;
    } else {
        const activeFloorIndex = submitData[currentIndex].floors.findIndex(floor => floor.id === this.roomIdObj.id);
        submitData[currentIndex].floors[activeFloorIndex].request.splice(index + 1, 0, comp);
        this.currentRequests = submitData[currentIndex].floors[activeFloorIndex].request;
    }
    await this.storage.set('submit_data', submitData);
    await this.service.updateFloors(this.roomIdObj.id, this.partiesInfo.unit_id);
  }

  async clearRequest(compID,index) {
      this.currentRequests.splice(index, 1);
      const current_index = await this.storage.get('current_index');
      var submit_data = await this.storage.get('submit_data');
      let active_floor: any;
      if (this.partiesInfo.unit_id !== '') {
          active_floor = submit_data[current_index].rooms.find(room => room.id === this.roomIdObj.id);
      } else {
          active_floor = submit_data[current_index].floors.find(floor => floor.id === this.roomIdObj.id);
      }
      active_floor.request = this.currentRequests;
      await this.storage.set('submit_data', submit_data);
      await this.service.updateFloors(this.roomIdObj.id, this.partiesInfo.unit_id);
  }

  async goToRequestPage(componentIndex, index = '') {
    let activeID = 2;
    if (this.currentProtocolId === 1 ||  ((this.currentProtocolId === 2 || this.currentProtocolId === 3) && this.partiesInfo.unit_id == '') ) {
      if (componentIndex === 1) {
          activeID = 3;
      } else {
          activeID = 4;
      }
    }
    if (index !== '') {
        activeID = componentIndex;
        await this.storage.set('currentSelectedRequestId', index);
        const locations  = await this.storage.get('locations');
        const currentLocation = locations.filter(loc => loc.id === this.currentRequests[index].location_id)[0];
        await this.storage.set('current_location', currentLocation);
    } else {
      await this.storage.set('currentSelectedRequestId', '');
    }
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        requestInfo: JSON.stringify({
          'id': this.roomIdObj.id,
          'component_id': componentIndex,
        })
      }
    }
    let serviceProviderId = '';
    if (this.currentProtocolId == 1 && this.partiesInfo.service_provider != '') {
       serviceProviderId = this.partiesInfo.service_provider;
    }

    let request_data = {
      activeId: activeID,
      isUpdated: false,
      deficiency:{title:'', description:'', service_provider: serviceProviderId, actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', due_date: '', inspection_images:[
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/prod11.jpg' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/houseplan.png' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/prod11.jpg' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/houseplan.png' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/houseplan.png' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/prod11.jpg' },
      // { img: 'http://localhost:8100/assets/images/living-room.jpg' },
      // { img: 'http://localhost:8100/assets/images/houseplan.png' },
      ]},
      normal_wear:{title:'', description:'', plan_location: [], plan_id: '', inspection_images:[]},
      re_cleaning:{title:'', description:'', service_provider: serviceProviderId, actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
      non_existent:{title:'', description:'', service_provider: serviceProviderId, actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', inspection_images:[]},
      open_issue:{title:'', description:'', service_provider: serviceProviderId, actionprotocol: 1, costbyprotocol: 1, sharedValue: 0, plan_location: [], plan_id: '', due_date: '', inspection_images:[]},
    } ;
      if (index === '') {
          const currentLocationData = null;
          await this.storage.set('current_location', currentLocationData);
      }
     /* setTimeout(() => {
        this.service.hideLoader();
      }, 500);*/
      await this.storage.set('request_data', request_data);
    this.router.navigate(['/request'], navigationExtras);
  }
}
