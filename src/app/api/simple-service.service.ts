import {Injectable} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './translation.service';
import { AlertPopupPage } from '../alert-popup/alert-popup.page';
import {Router} from '@angular/router';
import { EventEmitter } from '@angular/core';

@Injectable()
export class SimpleService {
  public synced$: any = new EventEmitter();
  loaderToShow: any;
  syncDataContainer: any = [];
  components: any = [];
  component_room_type: any = [];
  rooms: any = [];
  accessToken: string;
  datePickerObj: any;

  constructor(
      private storage: Storage,
      private modal: ModalController,
      public loadingController: LoadingController,
      public alertController: AlertController,
      public apiService: AuthService,
      public translate: TranslateService,
      public translations: TranslationService,
      public router: Router
  ) {}

  async checkLoader() {
     return this.loaderToShow;
  }

  async showLoader(loadingText?) {
    if (!loadingText) {
        if (this.translations.translationsList != null) {
            loadingText = this.translations.translationsList.offline_tool.messages.please_wait;
        } else {
            loadingText = '';
        }
    }
    this.loaderToShow = this.loadingController.create({
      message: loadingText
    }).then(async (res) => {
      await this.storage.set('loaderToShow', true);
      res.present();
      res.onDidDismiss().then((dis) => {
        // console.log('Loading dismissed!');
      });
    });
  }

  async hideLoader() {
      const isLoader = await this.storage.get('loaderToShow');
      if (isLoader) {
          setTimeout(async () => {
              await this.storage.set('loaderToShow', false);
              this.loadingController.dismiss();
          }, 200);
      }
  }

  links(translations) {
    return [
        {id: 1, name: translations.offline_tool.navigations.home, link: '/home', enable: true, active: false},
        {id: 2, name: translations.offline_tool.navigations.parties, link: '/parties', enable: false, active: false},
        {id: 3, name: translations.offline_tool.navigations.rooms, link: '/rooms', enable: false, active: false},
        {id: 4, name: translations.offline_tool.navigations.miscellaneous, link: '/miscellaneous', enable: false, active: false},
        {id: 5, name: translations.offline_tool.navigations.conclusion, link: '/conclusion', enable: false, active: false}
    ];
  }

    async presentAlertWithSingle(alertConfig, callback?) {
        let config = {};
        if (typeof alertConfig !== 'object') {
            config = {
                message: alertConfig,
            };
        } else {
            config = alertConfig;
        }
        const customClasss = alertConfig.hasOwnProperty('customClass') ? alertConfig.customClass : '';

        const modal =
            await this.modal.create({
                component: AlertPopupPage,
                cssClass: 'alert-popup-modal ' + customClasss,
                componentProps: {data: config}
            });
        modal.onDidDismiss()
            .then((data) => {
                if (callback) {
                    callback();
                }
            });

        await modal.present();
    }
    async presentConfirmPopupChangesLost(alertConfig, callback) {
        let config = {
            message: alertConfig,
            customClass: 'variation2',
            showYesButton: true,
            showNoButton: true
        };
        this.presentConfirmPopup(config, callback);
    }
    async presentConfirmPopup(alertConfig, callback?, callback1?) {
        let config = {};
        if (typeof alertConfig !== 'object') {
            config = {
                message: alertConfig,
                showYesButton: true,
                showNoButton: true
            };
        } else {
            config = alertConfig;
        }
        const customClasss = alertConfig.hasOwnProperty('customClass') ? alertConfig.customClass : '';
        const modal =
            await this.modal.create({
                component: AlertPopupPage,
                cssClass: 'alert-popup-modal ' + customClasss,
                componentProps: {data: config}
            });
        modal.onDidDismiss()
            .then((data) => {
                if (data) {
                    if (data.data) {
                        if (callback) {
                            callback();
                        }
                    } else {
                        if (callback1) {
                            callback1();
                        }
                    }
                }
            });

        await modal.present();
    }
  async syncData(accessToken, allowSync, clearDataSync?) {

      if (!allowSync) {
        const checkLogin = await this.storage.get('isFirstLogin');
        if (checkLogin) {
            allowSync = true;
        }
    }

      if (allowSync) {
            if (! await this.storage.get('loaderToShow')) {
                await this.showLoader('Bitte warten...');
            }
            this.apiService.syncData(accessToken).subscribe(async result => {
            const checkFirstLogin = await this.storage.get('isFirstLogin');
            this.syncDataContainer = result;

            this.components = this.syncDataContainer.components;

            this.rooms = Object.assign(this.syncDataContainer.rooms);
            this.component_room_type = this.syncDataContainer.component_room_type;

            let room_types = this.syncDataContainer.room_types;
            room_types.map(type => {
                let filtered = this.component_room_type.filter(item => item.room_type_id == type.id);
                type.component_ids = filtered.map(item => item.component_id);
            });

            if (!checkFirstLogin && !clearDataSync) {
                const existingRoomTypes = await this.storage.get('room_types');
                existingRoomTypes.forEach((roomType) => {
                    if (roomType.id >= 9999) {
                        room_types.push(roomType);
                    }
                });
                const existingComponents = await this.storage.get('all_components');
                existingComponents.forEach((component) => {
                    if (component.id >= 9999) {
                        this.components.push(component);
                    }
                });
            }

            let request_categories = this.syncDataContainer.constants.requests.category;
            const links = this.links(this.syncDataContainer.translations);
            await this.storage.set('links', links);
            await this.storage.set('property_managers', this.syncDataContainer.property_managers);
            await this.storage.set('main_categories', this.syncDataContainer.constants.requests.main_categories);
            await this.storage.set('catalog_protocol_type', this.syncDataContainer.catalog_protocol_type);
            await this.storage.set('catalog_room_floor', this.syncDataContainer.catalog_room_floor);
            await this.storage.set('residents', this.syncDataContainer.residents.map(item => ({
                ...item,
                full_name: item.first_name + ' ' + item.last_name
            })));
            await this.storage.set('translations', this.syncDataContainer.translations);
            await this.storage.set('settings', this.syncDataContainer.settings);
            await this.storage.set('units', this.syncDataContainer.units);
            await this.storage.set('buildings', this.syncDataContainer.buildings);
            await this.storage.set('quarters', this.syncDataContainer.quarters);
            await this.storage.set('cost_impact', this.syncDataContainer.constants.requests.cost_impact);
            await this.storage.set('relations_Status', this.syncDataContainer.constants.relations.status);
            await this.storage.set('request_categories', {0: 'okay', ...request_categories});
            await this.storage.set('action', this.syncDataContainer.constants.requests.action);
            await this.storage.set('unit_types', this.syncDataContainer.constants.units.type);
            await this.storage.set('house_owners', this.syncDataContainer.house_owners.map(item => ({
                ...item,
                full_name: item.first_name + ' ' + item.last_name + ' ' + item.city + ' ' + item.street + ' ' + item.zip + ' ' + item.state
            })));
            await this.storage.set('relations', this.syncDataContainer.relations);
            await this.storage.set('protocol_types', this.syncDataContainer.protocol_types);

            await this.storage.set('room_types', room_types);
            await this.storage.set('misc_key_lists', this.syncDataContainer.misc_key_lists);
            await this.storage.set('misc_generals', this.syncDataContainer.misc_generals);
            await this.storage.set('misc_key_list_protocol_type', this.syncDataContainer.misc_key_list_protocol_type);
            await this.storage.set('misc_general_protocol_type', this.syncDataContainer.misc_general_protocol_type);
            await this.storage.set('service_providers', this.syncDataContainer.service_providers.map(item => ({
                ...item,
                full_name: item.first_name + ' ' + item.last_name + ', ' + item.company_name
            })));
            await this.storage.set('all_components', this.components);
            await this.storage.set('floors', this.syncDataContainer.floors);
            await this.storage.set('requests', this.syncDataContainer.requests);
            await this.translations.getTranslations(true);
            let locations = await this.syncDataContainer.locations;
            if (locations.length != 0) {
                locations.map(location => {
                    const translatedName = this.translations.translateText(this.translations.translationsList.locations, location.name);
                    location.name = translatedName;
                });
                await this.storage.set('locations', locations);
            }

            await this.setTuGu();
            await this.setCompleteDataOfRooms();

            await this.hideLoader();

            let alertMessage = this.translations.translationsList.offline_tool.messages.data_fetched_successfully;

            if (clearDataSync) {
                await this.storage.set('submit_data', null);
                alertMessage = this.translations.translationsList.offline_tool.messages.data_cleared_successfully;
            }

            if (checkFirstLogin) {
                await this.storage.set('isFirstLogin', false);
            } else {
                const alertConfig = {
                    message: alertMessage,
                    type: 'success',
                    showOkButton: true
                };

                this.synced$.emit(true);
                if (clearDataSync) {
                    setTimeout(async () => {
                        this.presentAlertWithSingle(alertConfig, () => {
                            this.router.navigate(['/home']);
                        });
                    }, 200);
                } else {
                    setTimeout(async () => {
                        await this.presentAlertWithSingle(alertConfig);
                    }, 200);
                }
            }
        }, error => {
            this.hideLoader();
        });
      } else {
          setTimeout(async () => {
              await this.hideLoader();
          }, 500);
      }
  }
    async setCompleteDataOfRooms() {
        await Promise.all(this.rooms.map(async (room, index) => {
            room = {...room, complete: false, done: 0, components: [], core: true, complete_count: 0};
            await Promise.all(this.component_room_type.map(componentRoomType => {
                if (room.room_type == componentRoomType.room_type_id) {
                    this.components.map(component => {
                        if (component.id == componentRoomType.component_id) {
                            room.components.push(component);
                        }
                    });
                }
            }));
            room.components_count = room.components.length;
            room.components = room.components.map(item => {
                item = {...item, complete: false};
                return item;
            });
            this.rooms[index] = room;
        }));
        await this.storage.set('rooms', this.rooms);
    }

    async setTuGu() {
        let tuguData = [];
        this.syncDataContainer.service_providers.map(item => {
            item = {...item, tuguinfo: item.first_name + ' ' + item.last_name + ', ' + item.company_name};
            if (item.category == 8 || item.category == '8') {
                tuguData.push(item);
            }
        });
        await this.storage.set('tugu', tuguData);
    }



  async updateFloors(floorId, unitId?) {
      let currentIndex = await this.storage.get('current_index');
      let submitData = await this.storage.get('submit_data');
      let floor: any;
      if (unitId && unitId != '') {
          floor = submitData[currentIndex].rooms.find(floor => floor.id === floorId);
      } else {
          floor = submitData[currentIndex].floors.find(floor => floor.id === floorId);
      }
      if (floor.request) {
          const requestCount = floor.request.length;
          let completeCount = 0;
          let deficiencyCount = 0;
          let openissueCount = 0;
          floor.request.filter((floorData) => {
              if (floorData.complete) {
                  completeCount++;
              }
              if (floorData.category_id == 3) {
                  deficiencyCount++;
              } else {
                  openissueCount++;
              }
          });
          floor.deficiencyCount = deficiencyCount;
          floor.openissueCount = openissueCount;
          if (requestCount == completeCount) {
              floor.complete = true;
          } else {
              floor.complete = false;
          }
          floor.request.sort((a, b) => {
              return b.complete - a.complete;
          });
      }
      await this.storage.set('submit_data', submitData);
  }

  async updateRooms(roomId) {
      let currentIndex = await this.storage.get('current_index');
      let submitData = await this.storage.get('submit_data');
      const room = submitData[currentIndex].rooms.find(room => room.id === roomId);
      const roomIndex = submitData[currentIndex].rooms.findIndex(room => room.id === roomId);
      if (room.components) {
          room.done = room.complete_count;
          room.ok_count = room.components.filter(info => info.category_id == 0).length;
          room.not_ok_count = room.done - room.ok_count;
          if (room.complete_count == room.components_count) {
              room.complete = true;
          } else {
              room.complete = false;
          }
          submitData[currentIndex].rooms[roomIndex] = room;
      }
      await this.storage.set('submit_data', submitData);
  }

  getdatePickerObj(){
      return this.datePickerObj = {
        dateFormat: 'DD.MM.YYYY',
        inputDate: new Date(),
        btnCloseSetInReverse: true,
        momentLocale: 'de-DE',
        monthsList: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        setLabel: 'Wählen',
        todayLabel: 'Heute',
        closeLabel: 'Schliessen',
      };
  }

/*  async presentAlertWithSingle(title) {
    const alert = await this.alertController.create({
      message: title,
      buttons: ['OK']
    });

    await alert.present();
  }*/

/*  async presentConfirmPopup(title, callback) {
    const alert = await this.alertController.create({
      message: title,
      buttons: [
        {
            text: 'No',
            handler: () => {
                console.log('Cancel No clicked');
                return false;
            }
        },
        {
            text: 'Yes',
            handler: () => {
              console.log('clicked yes');
              callback();
              return true;
            }
        }
    ]
    });

    await alert.present();
  }*/

}
