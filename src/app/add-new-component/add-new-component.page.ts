import { Component, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { SimpleService } from '../api/simple-service.service';
import { LoadingController } from '@ionic/angular';
import { IonInput } from '@ionic/angular';

@Component({
    selector: 'add-component',
    templateUrl: './add-new-component.page.html',
    styleUrls: ['./add-new-component.page.scss'],
})
export class AddNewComponentPage implements OnInit {
    @ViewChild(IonInput, { static: false }) inputField: IonInput;
    selectedProtocol: any;
    selectedProtocolId: any;
    currentProtocolName: any;
    translations: any = [];
    roomIdObj: any;
    selectedComponent: any;
    allComponents: any;
    searchAllComponents: any;
    currentSubData: any;
    placeholderNewComponent: any;
    componentName: any;
    componentNameOld: any;
    all_components: any;
    room_components: any;
    navigationExtras: NavigationExtras;
    url:any;

    constructor(
        private storage: Storage,
        public loadingController: LoadingController,
        private router: Router,
        public service:SimpleService,
        private route: ActivatedRoute,
        public translate: TranslateService,
        public TranslationService: TranslationService
        ) {
            this.route.queryParams.subscribe(params => {
                if (params && params.roomInfo) {
                    this.roomIdObj = JSON.parse(params.roomInfo);
                }
            });
            this.storage.get('current_index').then((val) => {
                this.storage.get('submit_data').then((val1) => {
                    if (val1) {
                        this.currentSubData = val1[val];
                    }
                });
            });
        }

        ngOnInit() {
            this.storage.get('current_protocol').then((val) => {
                if (val) {
                    this.selectedProtocol = val;
                    this.selectedProtocolId = val.id;
                    this.currentProtocolName = val.name;
                }
            });
            this.storage.get('searchedKeyword').then((val) => {
                if (val) {
                    this.componentName = val;
                    this.componentNameOld = val;
                }
            });
        }

        ionViewWillLeave() {
            if (this.inputField) {
                this.inputField.disabled = true;
            }
        }
        async ionViewWillEnter() {
            setTimeout(() => {
                if (this.inputField) {
                    this.inputField.disabled = false;
                    this.inputField.setFocus();
                }
            }, 200);
            this.TranslationService.getTranslations();
            this.all_components = await this.storage.get('all_components');
            this.placeholderNewComponent = this.TranslationService.translationsList.offline_tool.placeholders.enter_new_component_name;
        }
        async goToRoomOrAddComponent() {
            if(this.roomIdObj.id == 999){
                if (this.componentName) {
                    this.componentName = this.componentName.trim();
                }
                if (this.componentName && this.componentName !== '') {
                    const current_index = await this.storage.get('current_index');
                    let submit_data = await this.storage.get('submit_data');
                    const new_component_count = submit_data[current_index].new_component_count ? submit_data[current_index].new_component_count : 0;
                    const componentID = 9999 + new_component_count;
                    var getRoomName = await this.storage.get('new_room_data');
                    getRoomName['new_component_name'] = this.componentName;
                   await this.storage.set('new_room_data',getRoomName);
                    let new_component = {
                        'id': componentID,
                        'name': this.componentName,
                        'unique_number': "BA" + componentID,
                        'complete': false,
                        'checked': false
                    };

                    this.all_components.push(new_component);
                    for (let g = 0; g < this.all_components.length; g++) {
                        if (this.all_components[g].checked) {
                            this.all_components[g].checked = false;
                        }
                    }

                    await this.storage.set('all_components', this.all_components);
                    this.router.navigate(['/add-room']);
                } else {
                    this.showValidation(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
                }
            } else {
                if (this.componentName) {
                    this.componentName = this.componentName.trim();
                }
                if (this.componentName && this.componentName !== '') {
                    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
                    const current_index = await this.storage.get('current_index');
                    let submit_data = await this.storage.get('submit_data');
                    let active_room = submit_data[current_index].rooms.find(room => room.id == this.roomIdObj.id);
                    this.room_components = active_room.components;
                    const new_component_count = submit_data[current_index].new_component_count ? submit_data[current_index].new_component_count : 0;
                    const componentID = 9999 + new_component_count;

                    let new_component = {
                        'id': componentID,
                        'name': this.componentName,
                        'unique_number': "BA" + componentID,
                        'complete': false,
                        'checked': false
                    };

                    this.all_components.push(new_component);
                    this.room_components.push(new_component);
                    for (let g = 0; g < this.all_components.length; g++) {
                        if (this.all_components[g].checked) {
                            this.all_components[g].checked = false;
                        }
                    }
                   await this.storage.set('all_components', this.all_components);

                    active_room.components = this.room_components;
                    // active_room.component_ids.push(componentID);
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
                    
                   await this.storage.set('submit_data', submit_data);
                    
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            roomInfo: JSON.stringify(this.roomIdObj)
                        }
                    };
                   /* setTimeout(() => {
                        this.service.hideLoader();
                      }, 500);*/
                    this.router.navigate(['/room-object'], navigationExtras);
                } else {
                    this.showValidation(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
                    /*const navigationExtras: NavigationExtras = {
                        queryParams: {
                            roomInfo: JSON.stringify(this.roomIdObj)
                        }
                    };
                    setTimeout(() => {
                        this.service.hideLoader();
                      }, 500);
                    this.router.navigate(['/add-component'], navigationExtras);*/
                }
            }
        }

        showValidation(message) {
            this.service.presentAlertWithSingle(message);
        }

        async goBackToRoomOrAddComponent() {
            this.url = await this.storage.get('backPageUrl');
            this.navigationExtras = {
                queryParams: {
                    roomInfo: JSON.stringify(this.roomIdObj)
                }
            };
            if (this.componentName != this.componentNameOld) {
                this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
                    if (this.url == '/add-component') {
                        this.router.navigate([this.url], this.navigationExtras);
                    } else {
                        this.router.navigate([this.url]);
                    }
                });
            } else {
           /* if (this.componentName) {
                this.service.presentConfirmPopup('', () => {
                    if (this.url == '/add-component') {
                        this.router.navigate([this.url], this.navigationExtras);
                    } else {
                        this.router.navigate([this.url]);
                    }
                });
            } else {*/
                if (this.url == '/add-component') {
                    this.router.navigate([this.url], this.navigationExtras);
                } else {
                    this.router.navigate([this.url]);
                }
           /* }*/

            }
        }
    }
