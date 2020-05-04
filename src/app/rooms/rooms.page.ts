import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {LoadingController} from '@ionic/angular';
import {SimpleService} from '../api/simple-service.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from '../api/translation.service';
import { ObservableService } from '../api/observable.service';

declare var require: any
var mergeJSON = require("merge-json");

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.page.html',
    styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {

    session_rooms: any = [];
    session_floors: any = [];
    allFloorCount: number;
    isCancel: any = false;
    data: any;
    doneComponent: any;
    isComplete: any = false;
    currentProtocolName: any;
    currentProtocolId: any;
    currentRoomData: any;
    currentRoomIndex: any;
    infoCompleteComponent: any = [];
    current_index: any;
    partiesInfo: any;
    submit_data: any;
    units: any;
    isRooms:boolean;
    componentValidationMessage: string;

    constructor(// private route: ActivatedRoute,
        private storage: Storage,
        private router: Router,
        public loadingController: LoadingController,
        public SimpleService: SimpleService,
        public translate: TranslateService,
        public TranslationService: TranslationService,
        public observableService: ObservableService) {
    }


    ngOnInit() {

    }
    async ionViewWillEnter() {
        if (!await this.storage.get('loaderToShow')) {
            await this.SimpleService.showLoader();
        }
        var current_index = await this.storage.get('current_index');
        var submit_data = await this.storage.get('submit_data');
        
        await this.storage.set('filter_list_value', null);
        await this.storage.set('new_room_data', null);
        this.TranslationService.getTranslations();
        this.storage.get('current_index').then((val) => {
            if (val) {
                this.current_index = val;
            }
        });

        this.storage.get('translations').then((val) => {
            if (val) {
                var newlist = mergeJSON.merge(val.protocol_types, val.rooms);
            }
        });
        const currentProtocol = await this.storage.get('current_protocol');
        this.currentProtocolName = currentProtocol.name;
        this.currentProtocolId = currentProtocol.id;

        var current_index = await this.storage.get('current_index');
        var submit_data = await this.storage.get('submit_data');
        this.partiesInfo = submit_data[current_index].parties;
        if (this.currentProtocolId == 1 || ((this.currentProtocolId == 2 || this.currentProtocolId == 3) && this.partiesInfo.unit_id == '')) {
            if (this.partiesInfo.unit_id !== '') {
                submit_data[current_index].floors = [];
                this.session_rooms = submit_data[current_index].rooms;
                this.isRooms = true;
                this.componentValidationMessage = this.TranslationService.translationsList.offline_tool.messages.Please_inspect_all_rooms;
                /*if (this.currentProtocolId == 1) {
                    this.session_rooms.map(room => {
                        delete room.components;
                        delete room.done;
                        delete room.complete_count;
                        delete room.components_count;
                        room.showDelete = true;
                       /!* if (room.request) {
                            const requestCount = room.request.length;
                            let completeCount = 0;
                            let deficiencyCount = 0;
                            let openissueCount = 0;
                            room.request.filter((roomData) => {
                                if (roomData.complete) {
                                    completeCount++;
                                }
                                if (roomData.category_id==3) {
                                    deficiencyCount++;
                                } else {
                                    openissueCount++;
                                }
                            });
                            room.deficiencyCount = deficiencyCount;
                            room.openissueCount = openissueCount;
                            if (requestCount == completeCount) {
                                room.complete = true;
                            } else {
                                room.complete = false;
                            }
                        }*!/
                        return room;
                    });
                }*/
                // else{
                //     this.storage.get('all_components').then((val) => {
                //         if (val) {
                //             var doneComp = 0;
                //             var isCompleteComponent = 0;
                //             for (var i = 0; i < val.length; ++i) {
                //                 if (val[i].complete) {
                //                     doneComp++;
                //                 } else {
                //                     isCompleteComponent++;
                //                 }
                //             }
                //             if (isCompleteComponent == 0) {
                //                 this.session_rooms[0].complete = true;
                //             }
                //             if (this.session_rooms.length > 0) {
                //                 this.session_rooms[0].done = doneComp;
                //             }
                //         }
                //     });
                // }
                /*submit_data[current_index].rooms = this.session_rooms;*/
            } else {
                submit_data[current_index].rooms = [];
                this.session_floors = submit_data[current_index].floors;
                this.isRooms = false;
                this.componentValidationMessage = this.TranslationService.translationsList.offline_tool.messages.Please_inspect_all_floors;
                this.allFloorCount = await this.getAllFloorCount(submit_data[current_index].parties.building_id);
                /*const session_floors =  submit_data[current_index].floors;
                this.session_floors = session_floors.filter((floor) => {
                    floor.showDelete = true;
                    return floor;
                });
                submit_data[current_index].floors = this.session_floors;*/
            }
            await this.storage.set('submit_data', submit_data);
        } else {
            this.units = await this.storage.get('units');
            this.session_rooms = submit_data[current_index].rooms;
            this.isRooms = true;
            this.componentValidationMessage = this.TranslationService.translationsList.offline_tool.messages.Please_inspect_all_rooms;
            // this.storage.get('all_components').then((val) => {
            //     if (val) {
            //         var doneComp = 0;
            //         var isCompleteComponent = 0;
            //         for (var i = 0; i < val.length; ++i) {
            //             if (val[i].complete) {
            //                 doneComp++;
            //             } else {
            //                 isCompleteComponent++;
            //             }
            //         }
            //         if (isCompleteComponent == 0) {
            //             this.session_rooms[0].complete = true;
            //         }
            //         if (this.session_rooms.length > 0) {
            //             this.session_rooms[0].done = doneComp;
            //         }
            //     }
            // });

            /*this.session_rooms.map(room => {
                if (room.components) {
                    room.done = room.complete_count;
                    room.ok_count = room.components.filter(info => info.category_id == 0).length;
                    room.not_ok_count = room.done - room.ok_count;
                    if (room.complete_count == room.components_count) {
                        room.complete = true;
                    } else {
                        room.complete = false;
                    }
                }
                /!*room.showDelete = true;*!/
                return room;
            });
            submit_data[current_index].rooms = this.session_rooms;
            this.storage.set('submit_data', submit_data);*/

        }
        let links = await this.storage.get('links');
        if (this.observableService.isRoomsChanged == true) {
            links = links.map(link => {
                if (link.id > 3) {
                    link.enable = false;
                }
                return link;
            });
        } else {
            let completeComponents: any = [];
            completeComponents = this.checkComponentCategories();
            links = this.observableService.modifyLinks(links, 3, completeComponents);
        }
        this.observableService.setLinks(links);
        await this.SimpleService.hideLoader();
    }
    checkComponentCategories() {
        return (!this.isRooms ? this.session_floors : this.session_rooms);
    }
    async goToMisc() {
        let completeComponents: any = [];
        completeComponents = this.checkComponentCategories();
        let completed_room_length = completeComponents.filter(item => !!item.complete).length;
        if (completed_room_length < completeComponents.length) {
            const config = {
                message: this.componentValidationMessage,
                customClass: 'variation2'
            };
            this.SimpleService.presentAlertWithSingle(config);
        } else {
            const current_index = await this.storage.get('current_index');
            let submit_data = await this.storage.get('submit_data');
            if (submit_data[current_index].protocol_type.id == 4 || submit_data[current_index].protocol_type.id == 5) {
            if (!!submit_data[current_index].miscellaneous.key && !!submit_data[current_index].miscellaneous.general) {
                if (submit_data[current_index].miscellaneous.key.length == 0 && submit_data[current_index].miscellaneous.general.length == 0) {
                    let key = await this.storage.get('misc_key_lists');
                    let general = await this.storage.get('misc_generals');
                    let miscKeyProtocolType = await this.storage.get('misc_key_list_protocol_type');
                    let miscGeneralProtocolType = await this.storage.get('misc_general_protocol_type');
                    let units = await this.storage.get('units');
                    miscGeneralProtocolType.map(generalProtocol => {
                        let currentGeneralVal = general.find(item => item.id == generalProtocol.misc_general_id);
                        if (!!currentGeneralVal && generalProtocol.protocol_type_id == submit_data[current_index].protocol_type.id) {
                            submit_data[current_index].miscellaneous.general.push(currentGeneralVal);
                        }
                    });
                        let unitType;
                        let selectedUnit, filterUnit;
                        filterUnit = submit_data[current_index].parties.unit_ids.map(unitId => {
                         selectedUnit = units.find(unit => unit.id == unitId);  
                         if (!!selectedUnit)  {
                             if (selectedUnit.type == 1 || selectedUnit.type == 2) {
                                return selectedUnit;
                             } 
                         }
                        })[0];
                        if (!filterUnit) {
                            unitType = 1;
                        } else {
                            unitType = filterUnit.type;
                        }
                        miscKeyProtocolType.map(miscKeyProtocol => {
                            if (unitType == miscKeyProtocol.unit_type) {
                                let currentKeyVal = key.find(item => item.id == miscKeyProtocol.misc_key_list_id);
                                if (!!currentKeyVal && miscKeyProtocol.protocol_type_id == submit_data[current_index].protocol_type.id) {
                                    submit_data[current_index].miscellaneous.key.push(currentKeyVal);
                                }
                            }
                        });
                        await this.storage.set('submit_data', submit_data);
                }
            }
            }
            this.router.navigate(['/miscellaneous']);
        }
    }
    goToParties(){
        this.router.navigate(['/parties']);
    }

    async presentLoading(roomObject: any, index) {
        if (this.isCancel == false) {
            this.SimpleService.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    roomInfo: JSON.stringify({'id': roomObject.id, 'room_name': roomObject.name})
                }
            }
            this.router.navigate(['/room-object'], navigationExtras);
            /*setTimeout(() => {
                this.SimpleService.hideLoader();
            }, 500);*/
        }
    }


    editClick() {
        this.isCancel = !this.isCancel;
    }

    async eraseRoom(event: Event, room: any, index) {
        event.stopPropagation();
        this.current_index = await this.storage.get('current_index');
        this.submit_data = await this.storage.get('submit_data');
        this.currentRoomIndex = index;
        this.currentRoomData = this.submit_data[this.current_index].rooms[this.currentRoomIndex];
        if (this.currentProtocolId == 4 || this.currentProtocolId == 5) {
            const unitType = this.units.filter(unit => unit.id ==  this.currentRoomData.unit_id)[0].type;
            if (unitType != 1 && unitType != 2) {
                const config = {
                    message: this.TranslationService.translationsList.offline_tool.messages.can_not_delete_single_unit,
                    customClass: 'variation3'
                };
                await this.SimpleService.presentAlertWithSingle(config);
                return;
            }
        }
        if (this.currentRoomData.complete_count > 0) {
            await this.SimpleService.presentConfirmPopup(this.TranslationService.translationsList.offline_tool.messages.are_you_sure_to_delete_room, async () => {
                this.session_rooms[this.currentRoomIndex].showDelete = false;
                this.session_rooms = this.session_rooms.filter(item => item.id != this.currentRoomData.id);
                this.submit_data[this.current_index].rooms = this.session_rooms;
                await this.storage.set('submit_data', this.submit_data);
            }, () => {
                this.session_rooms[this.currentRoomIndex].showDelete = true;
            });
        } else {
            this.session_rooms = this.session_rooms.filter(item => item.id != room.id);
            this.submit_data[this.current_index].rooms = this.session_rooms;
            await this.storage.set('submit_data', this.submit_data);
        }
    }
    async eraseFloor(event: Event, floor: any, index) {
        event.stopPropagation();
        this.current_index = await this.storage.get('current_index');
        this.submit_data = await this.storage.get('submit_data');
        this.currentRoomIndex = index;
        this.currentRoomData = this.submit_data[this.current_index].floors[this.currentRoomIndex];
        if (this.currentRoomData.hasOwnProperty('request') && this.currentRoomData.request.length > 0) {
            this.SimpleService.presentConfirmPopup(this.TranslationService.translationsList.offline_tool.messages.are_you_sure_to_delete_floor, async () => {
                this.session_floors[this.currentRoomIndex].showDelete = false;
                this.session_floors = this.session_floors.filter(item => item.id != this.currentRoomData.id);
                this.submit_data[this.current_index].floors = this.session_floors;
                await this.storage.set('submit_data', this.submit_data);
            }, () => {
                this.session_floors[this.currentRoomIndex].showDelete = true;
            });
        } else {
            this.session_floors = this.session_floors.filter(item => item.id != floor.id);
            this.submit_data[this.current_index].floors = this.session_floors;
            await this.storage.set('submit_data', this.submit_data);
        }
    }

    /**
     * method to retrieve api floor count
     * @param buildingId param to fetch all floors based on building
     */
    async getAllFloorCount(buildingId) {
        const buildings = await this.storage.get('buildings');
        const allFloorsIds = buildings.filter(building => building.id === buildingId)[0].floors;
        return allFloorsIds.length;
    }
}
