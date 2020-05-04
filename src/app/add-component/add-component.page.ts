import { Component, OnInit} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { LoadingController } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';
@Component({
  selector: 'add-component',
  templateUrl: './add-component.page.html',
  styleUrls: ['./add-component.page.scss'],
})
export class AddComponentPage implements OnInit {
  selectedProtocol: any;
  selectedProtocolId: any;
  currentProtocolName: any;
  translations: any = [];
  roomIdObj: any;
  selectedComponent: any;
  allComponents: any;
  searchAllComponents: any;
  currentSubData: any;
  searchText: any;


    filterListType:any;
    filterListValue:any;
    listHeader: any;
    filterId: any;
    filterName: any;
    filterAddNew: any;
    listArr:any = [];
    filteredListArr:any = [];

  constructor(
    private storage: Storage,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public service:SimpleService,
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
  }

  async ionViewWillEnter() {
      if (!await this.storage.get('loaderToShow')) {
          await this.service.showLoader();
      }
      await this.TranslationService.getTranslations();
      this.filterListType = await this.storage.get('filter_list_name');
      this.filterListValue = '';
      if (this.filterListType == 'add_component') {
          this.listHeader = this.TranslationService.translationsList.offline_tool.labels.components;
          this.storage.get('all_components').then(async (val2) => {
              if (val2) {
                  this.allComponents = val2;
                  //const currentRoomComponents = this.currentSubData.rooms.find(x => x.id === this.roomIdObj.id).components;
                  //currentRoomComponents.forEach((component) => {
                      this.allComponents = this.allComponents.map((obj) => {
                          if(this.TranslationService.translationsList.components[obj.name]){
                            obj.transName = this.TranslationService.translationsList.components[obj.name];
                          } else {
                            obj.transName = obj.name;
                          }
                          return obj;//obj.id !== component.id;
                      });
                  //});
                  this.listArr = this.allComponents;
                  this.filteredListArr = this.allComponents;
                  this.filterId = 'id';
                  this.filterName = 'transName';
                  this.filterAddNew = true;
                  if (!!this.filterListValue) {
                      this.listArr = this.filteredListArr.filter(item => item.id == this.filterListValue);
                      let tempList = this.filteredListArr.filter(item => item.id !== this.filterListValue);
                      this.listArr = this.listArr.concat(tempList);
                  }
                  await this.service.hideLoader();
              } else {
                  await this.service.hideLoader();
              }
          }, async () => {
              await this.service.hideLoader();
          });
      } else {
          await this.service.hideLoader();
      }

  }


  async goToRoom() {
    const selectedId = await this.storage.get('filter_list_value');
    this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
    if (selectedId && selectedId !== '') {
        const currentSelectedmIndex = this.allComponents.findIndex(x => x.id === selectedId);
        this.selectedComponent = this.allComponents[currentSelectedmIndex];
        this.storage.get('current_index').then((val) => {
            this.storage.get('submit_data').then((val1) => {
                if (val1) {
                    this.currentSubData = val1;
                    this.storage.get('all_components').then(async (val2) => {
                        if (val2) {
                            this.selectedComponent.complete = false;
                            delete this.selectedComponent.transName;
                            this.allComponents = val2;
                            const currentRoomIndex = this.currentSubData[val].rooms.findIndex(x => x.id === this.roomIdObj.id);
                            // this.currentSubData[val].rooms[currentRoomIndex].component_ids.push(this.selectedComponent.id);
                            this.currentSubData[val].rooms[currentRoomIndex].components.push(this.selectedComponent);
                            this.currentSubData[val].rooms[currentRoomIndex].components_count++;

                            this.currentSubData[val].rooms[currentRoomIndex].complete = false;
                            if (this.currentSubData[val].rooms[currentRoomIndex].complete_count == this.currentSubData[val].rooms[currentRoomIndex].components_count) {
                                this.currentSubData[val].rooms[currentRoomIndex].complete = true;
                            }
                           await this.storage.set('submit_data', this.currentSubData);
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    roomInfo: JSON.stringify(this.roomIdObj)
                                }
                            };
                            /*setTimeout(() => {
                                this.service.hideLoader();
                              }, 500);*/
                            this.router.navigate(['/room-object'], navigationExtras);
                        }
                    });

                }
            });
        });
    } else {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                roomInfo: JSON.stringify(this.roomIdObj)
            }
        };
        /*setTimeout(() => {
            this.service.hideLoader();
          }, 500);*/
        this.router.navigate(['/room-object'], navigationExtras);
    }
  }

  gotoRoomObject() {
      const navigationExtras: NavigationExtras = {
          queryParams: {
              roomInfo: JSON.stringify(this.roomIdObj)
          }
      };
      this.router.navigate(['/room-object'], navigationExtras);
  }
}
