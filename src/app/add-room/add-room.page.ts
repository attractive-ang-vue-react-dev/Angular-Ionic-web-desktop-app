import { Component, OnInit } from '@angular/core';
import { Router,NavigationExtras} from '@angular/router';
import { Storage } from '@ionic/storage';
import { SimpleService } from '../api/simple-service.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../api/translation.service';
import { RouterExtService } from '../api/router-ext.service';
import { ObservableService } from '../api/observable.service';

declare var require: any
var mergeJSON = require("merge-json") ;

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.page.html',
  styleUrls: ['./add-room.page.scss'],
})
export class AddRoomPage implements OnInit {
  roomName:any;
  roomTypeId:any;
  roomTypes:any=[];
  all_components:any=[];
  isNewRoomType:any=false;
  roomTypeLength:any;
  roomsLength:any;
  rooms:any;
  componentLength:any;
  isAddNewRoom:any=false;
  showRelationDropDown:any=false;
  addNewRoomValue:any;
  txtAddButton:string;
  placeholderAddComponent:string='enter_new_component_name';
  txtSaveButton:string='save';
  txtCancelButton:string='cancel';
  currentProtocolName:any;
  selectedProtocolId:any;
  selectedRoomTypeData:any;
  sortedArr:any=[];
  sortedArrUnchecked:any=[];
  relationName:any='';
  partiesInfo:any;
  filterId: any;
  filterName: any;
  listArr:any = [];
  filterListValues:any = [];


  constructor(public translate: TranslateService,private router: Router,private storage: Storage,public service:SimpleService,public alertController: AlertController,  public TranslationService: TranslationService, private routerExtService: RouterExtService,
    public observableService: ObservableService) { }

 async ngOnInit() {
    var newRoomJson = {'new_room_name':'','new_room_type':'','room_type':'','isNewRoomType':false};
    await this.storage.set('new_room_data', newRoomJson);
  }
  ionViewDidEnter() {

    // this.storage.get('translations').then((val) => {
      //   if(val){
        //     var newlist = mergeJSON.merge(val.components, val.room_types)
        //     this.translate.setTranslation('el', newlist);
        //   }
        // });

        this.storage.get('submit_data').then((val) => {
          if(val){
            // console.log('submit', val);
          }
        });

        const ionSelects = document.querySelectorAll('ion-select');
        ionSelects.forEach((sel) => {
          sel.shadowRoot.querySelectorAll('.select-icon-inner')
          .forEach((elem) => {
            elem.setAttribute('style', 'display: none;');
          });
        });
      }

      async ionViewWillEnter() {
        this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
        const previous = this.routerExtService.getPreviousUrl();
        if (previous && previous == '/rooms') {
            await this.storage.set('new_room_type_id', '');
            await this.storage.set('new_room_relation', '');
        }
        const protocolData = await this.storage.get('current_protocol');
        this.selectedProtocolId = protocolData.id;
        this.currentProtocolName = protocolData.name;
       await this.storage.set('searchedKeyword', '');
        this.TranslationService.getTranslations();
        this.rooms = await this.storage.get('rooms');
        var getRoomName = await this.storage.get('new_room_data');
        this.roomsLength = this.rooms.length;
        this.roomTypes = await this.storage.get('room_types');
        this.roomTypeLength = this.roomTypes.length;
        const current_index = await this.storage.get('current_index');
        let submit_data = await this.storage.get('submit_data');
        this.partiesInfo =   submit_data[current_index].parties;
        if(this.partiesInfo.hasOwnProperty('relation_ids')) {
            if (this.partiesInfo.relation_ids.length > 1) {
                this.showRelationDropDown = true;
            }
        }
        const relationsForResident = await this.storage.get('relationsForResident');
        const new_room_relation = await this.storage.get('new_room_relation');
        if (this.showRelationDropDown && new_room_relation && relationsForResident) {
          this.relationName = relationsForResident.filter( res => res.relation_id == new_room_relation)[0].name;
        } else {
          this.relationName = '';
        }

        this.all_components = await this.storage.get('all_components');
        for (let index = 0; index < this.all_components.length; index++) {
          var transaltedRoomType = this.TranslationService.translationsList.components[this.all_components[index].name];
          if(transaltedRoomType){
            this.all_components[index]['translated_name'] = transaltedRoomType;
          } else {
            this.all_components[index]['translated_name'] = this.all_components[index].name;
          }
        }

        this.componentLength = this.all_components.length;
        this.all_components.sort((a, b) => (a.translated_name > b.translated_name) ? 1 : -1);

        // this.translate.get('offline_tool.headings.'+this.txtAddButton).subscribe((res: string) => {
          this.txtAddButton = this.TranslationService.translationsList.offline_tool.headings.add_component;
          // });

          if(getRoomName){
            this.roomName = getRoomName.new_room_name;
            let filterListValue = await this.storage.get('new_room_type_id');
            if (this.roomTypeId != filterListValue || !this.roomName) {
             await this.storage.set('filter_list_values', []);
            }
            this.roomTypeId = filterListValue;
            if(getRoomName.new_component_name && getRoomName.new_component_name!=''){
              this.setNewComponent(getRoomName.new_component_name);
            }
            if(getRoomName.isNewRoomType){
              this.roomTypeId = 'new';
              this.addNewRoomValue = getRoomName.new_room_type;
              this.selectedRoomTypeData = getRoomName.new_room_type;
              this.setAddNewRoom();
            } else {
              var newRoomData = this.roomTypes.find(item => item.id == filterListValue);
              if(newRoomData)
                this.selectedRoomTypeData = newRoomData.name;
            }
            this.onChangeRoomType();
          }
        //  setTimeout(() => {
        await this.service.hideLoader();
        //  }, 500);
        }
        async setAddNewRoom(){
          if(this.addNewRoomValue=='' || this.addNewRoomValue == undefined){
            this.roomTypeId = '';
          } else {
            this.isAddNewRoom = false;

            const current_index = await this.storage.get('current_index');
            var submit_data = await this.storage.get('submit_data');

            const new_room_type_count = submit_data[current_index].new_room_type_count ? submit_data[current_index].new_room_type_count : 0;

            this.roomTypeId = 9999 + new_room_type_count;

            var new_room_type = {
              "id" : this.roomTypeId,
              "name" : this.addNewRoomValue,
              "unique_number" : "RT" + this.roomTypeId,
              "component_ids": [],
            };

            if (submit_data[current_index].new_room_types == null)
              submit_data[current_index].new_room_types = [];

            submit_data[current_index].new_room_types.push(new_room_type);
            submit_data[current_index].new_room_type_count = new_room_type_count + 1;

           await this.storage.set('submit_data', submit_data);
            this.roomTypes.push(new_room_type);
            this.addNewRoomValue = '';
          }
        }

        async onChangeRoomType() {
          var getArrVal = [];
          var getArrValUnchecked = [];
          this.filterListValues = !!await this.storage.get('filter_list_values') ? await this.storage.get('filter_list_values') : [];
          if(!!this.roomTypeId){
            if (this.roomTypeId == 'new') {
              this.isNewRoomType = true;
              this.isAddNewRoom = true;
              if (this.filterListValues.length == 0) {
                this.all_components.map(allComp => {
                  allComp.isChecked = false;
                  getArrValUnchecked.push(allComp);
                });
              }
            } else {
              this.isAddNewRoom = false;
              this.isNewRoomType = false;

              let room_types = this.roomTypes;

              let selectedRoomType = room_types.find(item => item.id == this.roomTypeId);
              let room_type_component_ids;
              if(selectedRoomType){
                room_type_component_ids = selectedRoomType.component_ids ? selectedRoomType.component_ids : [];
              }
              if (selectedRoomType && this.filterListValues.length == 0) {
                this.all_components.map(item => {
                  item.isChecked = room_type_component_ids.includes(item.id) ? true : false;
                  if(item.isChecked){
                    getArrVal.push(item);
                  } else {
                    getArrValUnchecked.push(item);
                  }
                });
              }
            }
          } else {
            if (this.filterListValues.length == 0) {
              this.all_components.map(allComp => {
                allComp.isChecked = false;
                getArrValUnchecked.push(allComp);
              });
            }
          }
          if (this.filterListValues.length != 0) {
            this.filterListValues.map(filterListVal => {
              if (filterListVal.isChecked) {
                getArrVal.push(filterListVal);
              } else {
                getArrValUnchecked.push(filterListVal);
              }
            });
          }
          this.sortedArr = getArrVal;
          this.sortedArrUnchecked = getArrValUnchecked;
          this.sortedArr.sort((a, b) => (a.translated_name > b.translated_name) ? 1 : -1);
          this.sortedArrUnchecked.sort((a, b) => (a.translated_name > b.translated_name) ? 1 : -1);
          this.sortedArr = this.sortedArr.concat(this.sortedArrUnchecked);
          this.all_components = this.sortedArr;
          this.listArr = this.all_components;
          this.filterId = 'id';
          this.filterName = 'translated_name';
        }

        async setNewComponent(ComponentName){
          const current_index = await this.storage.get('current_index');
          var submit_data = await this.storage.get('submit_data');


          if(submit_data[current_index].new_component_count == null)
            submit_data[current_index].new_component_count = 0;
          const new_component_count = submit_data[current_index].new_component_count ? submit_data[current_index].new_component_count : 0;

          let new_component_id = 9999 + new_component_count;
          var new_component = {
            'id': new_component_id,
            'name': ComponentName,
            'unique_number': "BA"+ new_component_id,
            'complete': false,
            'checked': false
          };


          // this.all_components.push(new_component);
          submit_data[current_index].new_component_count = new_component_count + 1;
         await this.storage.set('submit_data', submit_data);
          var getRoomName = await this.storage.get('new_room_data');
          getRoomName.new_component_name = '';
         await this.storage.set('new_room_data',getRoomName);
        }

        // async addNewComponentData(Header) {
          //   this.translate.get('offline_tool.placeholders.enter_new_component_name').subscribe((res: string) => {
            //     this.placeholderAddComponent = res;
            //   });
            //   this.translate.get('offline_tool.labels.save').subscribe((res: string) => {
              //     this.txtSaveButton = res;
              //   });
              //   this.translate.get('offline_tool.labels.cancel').subscribe((res: string) => {
                //     this.txtCancelButton = res;
                //   });

                //   const alert = await this.alertController.create({
                  //     header: Header,
                  //     inputs: [
                  //       {
                    //         name: 'Component',
                    //         type: 'text',
                    //         placeholder:  this.placeholderAddComponent
                    //       }],
                    //       buttons: [
                    //         {
                      //           text: this.txtCancelButton,
                      //           role: 'cancel',
                      //           cssClass: 'secondary',
                      //           handler: (blah) => {
                        //             // console.log('Confirm Cancel: blah');
                        //           }
                        //         }, {
                          //           text: this.txtSaveButton,
                          //           handler: async (alertData) => {
                            //             // console.log('Confirm Okay');

                            //             const current_index = await this.storage.get('current_index');
                            //             var submit_data = await this.storage.get('submit_data');

                            //             if(alertData.Component == '')
                            //             return false;
                            //             if(submit_data[current_index].new_component_count == null)
                            //             submit_data[current_index].new_component_count = 0;
                            //             const new_component_count = submit_data[current_index].new_component_count ? submit_data[current_index].new_component_count : 0;

                            //             let new_component_id = 9999 + new_component_count;
                            //             var new_component = {
                              //               'id': new_component_id,
                              //               'name': alertData.Component,
                              //               'unique_number': "BA"+ new_component_id,
                              //               'complete': false,
                              //               'checked': false
                              //             };

                              //             this.all_components.push(new_component);

                              //             submit_data[current_index].new_component_count = new_component_count + 1;
                              //             this.storage.set('submit_data', submit_data);
                              //           }
                              //         }
                              //       ]
                              //     });

                              //     await alert.present();
                              //   }

                              isTranslateAvailable(selectedRoomTypeData){
                                if(this.TranslationService.translationsList){
                                  var isAv = this.TranslationService.isTranslationAvailable(this.TranslationService.translationsList.rooms, selectedRoomTypeData);
                                  return isAv;
                                } else {
                                  return false;
                                }
                              }


                              async goToRoomsPage(){
                                let isValidate = false;
                                if (this.roomName == undefined || this.roomName == '') {
                                  isValidate = true;
                                } else {
                                  if (this.selectedProtocolId != 1) {
                                      for (let index = 0; index < this.all_components.length; index++) {
                                          if (this.all_components[index].isChecked){
                                              isValidate = false;
                                              break;
                                          } else {
                                              isValidate = true;
                                          }
                                      }
                                  }
                                }

                                const new_room_relation = await this.storage.get('new_room_relation');
                                if(this.showRelationDropDown) {
                                    if (new_room_relation) {
                                      if(new_room_relation == '') {
                                          isValidate = true;
                                      }
                                    } else {
                                        isValidate = true;
                                    }
                                }

                                if(isValidate){
                                  this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_all_required_fields);
                                  return;
                                }



                                const current_index = await this.storage.get('current_index');
                                var submit_data = await this.storage.get('submit_data');

                                const new_room_count = submit_data[current_index].new_room_count ? submit_data[current_index].new_room_count : 0;

                                const roomID = 9999 + new_room_count;


                                if(this.roomName){
                                  let new_room: any;
                                  let relation_id = '';
                                  let unit_id = '';
                                  let plan_id = '';
                                  let full_url = '';
                                  const relationsForResident = await this.storage.get('relationsForResident');
                                  if (this.showRelationDropDown) {
                                      unit_id = relationsForResident.filter( res => res.relation_id == new_room_relation)[0].id;
                                      relation_id = new_room_relation;
                                  } else {
                                    if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
                                        relation_id = this.partiesInfo.relation_ids[0];
                                        unit_id = this.partiesInfo.unit_ids[0];
                                    }
                                  }
                                  if(relation_id){
                                    const latestPlan = relationsForResident.filter( res => res.relation_id == relation_id)[0].latest_plan;
                                    if (latestPlan) {
                                      plan_id = latestPlan.id;
                                      full_url = latestPlan.full_url;
                                    }
                                  }
                                  new_room = {
                                    'id': roomID,
                                    'name': this.roomName,
                                    'unique_number': "RA"+ roomID,
                                    'room_type': !!this.roomTypeId ? parseInt(this.roomTypeId): '',
                                    'complete': false,
                                    'core': false,
                                    'showDelete': true,
                                  };

                                  if(this.selectedProtocolId ==4 || this.selectedProtocolId==5) {
                                    new_room.relation_id = relation_id;
                                    new_room.unit_id = unit_id;
                                    new_room.full_url = full_url;
                                    new_room.plan_id = plan_id;
                                  }

                                  if (this.selectedProtocolId != 1) {
                                      new_room.done = 0;
                                      new_room.components_count = 0;
                                      new_room.complete_count = 0;
                                      new_room.components = [];
                                  }
                                  if (this.selectedProtocolId != 1) {
                                      let checked_components = this.all_components.filter(item => item.isChecked == true)
                                      new_room.components = [...checked_components];
                                      let component_ids = checked_components.map(item => item.id);
                                      new_room.components_count = new_room.components.length;
                                      new_room.components.map(comp => comp.complete = false);
                                      if (this.roomTypeId >= 9999) {
                                          let activeRoomType = this.roomTypes.find(item => item.id == this.roomTypeId);
                                          activeRoomType.component_ids = component_ids;
                                          let selected_new_room_type = submit_data[current_index].new_room_types.find(item => item.id == this.roomTypeId);
                                          selected_new_room_type.component_ids = activeRoomType.component_ids;
                                      }
                                  }


                                  submit_data[current_index].rooms.push(new_room);

                                  if(submit_data[current_index].new_room_count == null) {
                                    submit_data[current_index].new_room_count = 0;
                                  }
                                  submit_data[current_index].new_room_count = new_room_count + 1;

                                 await this.storage.set('submit_data', submit_data);
                                 await this.storage.set('filter_list_values', []);
                                 await this.storage.set('room_types', this.roomTypes);

                                }

                                this.roomName = '';
                                this.roomTypeId = '';
                                this.observableService.isRoomsChanged = true;
                                this.router.navigate(['/rooms']);
                              }

                              async openListSelector(filterListName) {
                                if (filterListName == 'new_room_relation') {
                                    await this.storage.set('filter_list_name', filterListName);
                                    this.router.navigate(['/add-room-inner']);
                                } else {
                                    this.router.navigate(['/add-room-name']);
                                }
                              }

                             async  backToRoomPage() {
                                let showValidate = false;
                                if (this.roomTypeId ||  this.roomName) {
                                    showValidate = true;
                                } else if (this.showRelationDropDown) {
                                    const new_room_relation = await this.storage.get('new_room_relation');
                                    if (new_room_relation) {
                                        showValidate = true;
                                    }
                                }

                                if (showValidate) {
                                    this.showValidationAndGotoRoute(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, '/rooms');
                                } else {
                                   await this.storage.set('filter_list_values', []);
                                    this.router.navigate(['/rooms']);
                                }
                              }

                              showValidationAndGotoRoute(message, route) {
                                  this.service.presentConfirmPopupChangesLost(message, () => {
                                      this.router.navigate([route]);
                                  });
                              }

                              async openRoomTypeSelector(filterRoomTypeName) {
                                  await this.storage.set('new_room_name', filterRoomTypeName);
                                  this.router.navigate(['/add-room-type']);
                              }
                            }
