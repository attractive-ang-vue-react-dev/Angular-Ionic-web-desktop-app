import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ObservableService } from '../api/observable.service';

@Component({
  selector: 'app-add-room-inner',
  templateUrl: './add-room-inner.page.html',
  styleUrls: ['./add-room-inner.page.scss'],
})
export class AddRoomInnerPage implements OnInit {
  filterListName:any;
  filterListValue:any;
  listHeader: any;
  filterId: any;
  filterName: any;
  listArr:any = [];
  filteredList:any = [];
  filterListValues:any = [];
  realstate_company:any;
  multiSelect:boolean = false;
  goBack:boolean = false;
  partiesInfo:any;
  selectedProtocol:any;
  selectedProtocolId:any;
  currentProtocolName:any;
  searchPlaceholder:any = '';
  noDataFound:any = '';
  backTitle:any = '';
  unitTypes:any = [];
  relationIds:any = [];
  showFilterList:boolean = false;
  constructor(private storage: Storage,
    private router: Router,
    private TranslationService: TranslationService,
    public observableService: ObservableService,
    public translate: TranslateService) {
    }

  ngOnInit() {
  }
  async ionViewWillEnter() {

    const currentProtocol = await this.storage.get('current_protocol');
    this.selectedProtocol = currentProtocol;
    this.selectedProtocolId = currentProtocol.id;
    this.currentProtocolName = currentProtocol.name;
    const currentIndex = await this.storage.get('current_index');
    const submitData = await this.storage.get('submit_data');
    const partiesInfo = submitData[currentIndex].parties;
    this.filterListName = await this.storage.get('filter_list_name');
    this.filterListValue = await this.storage.get('new_room_relation');
    this.showFilterList = true;
    this.searchPlaceholder =  this.TranslationService.translationsList.offline_tool.placeholders.search;
    this.noDataFound =  this.TranslationService.translationsList.offline_tool.messages.no_data_found;
    this.backTitle =  this.TranslationService.translationsList.offline_tool.labels.add_new_room;
    if (this.filterListName == 'new_room_relation') {
          this.listArr = [];
          this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.unit;
          const unitTypesNames = await this.storage.get('unit_types');
          const listArr = await this.storage.get('relationsForResident');
          listArr.filter((list) => {
            partiesInfo.relation_ids.forEach((val) => {
              if (val == list.relation_id) {
                let translatedUnitType = this.TranslationService.getTranslatedListValue(this.TranslationService.translationsList.units.type, list.type, unitTypesNames);
                list.displayUnitDataRoom = (!!list.name && list.name != '' ? list.name:'')  + (!!list.type && list.type!='' ?' -- '+ translatedUnitType:'');
                  this.listArr.push(list);
              }
            });
          });
          this.filteredList = this.listArr;
          this.filterId = 'relation_id';
          this.filterName = 'displayUnitDataRoom';
          this.goBack = true;
      }
  }
  async closeListSelector() {
    this.filterListValue = await this.storage.get('filter_list_value');
   await this.storage.set('new_room_relation', this.filterListValue);
    this.router.navigate(['/add-room']);
  }
  async goToAddRoom() {
    this.router.navigate(['/add-room']);
  }
}
