import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { ObservableService } from '../api/observable.service';
import { IonInput } from '@ionic/angular';
import { SimpleService } from '../api/simple-service.service';

@Component({
  selector: 'app-parties-inner',
  templateUrl: './parties-inner.page.html',
  styleUrls: ['./parties-inner.page.scss'],
})
export class PartiesInnerPage implements OnInit {
  @ViewChild(IonInput, { static: false }) inputField: IonInput;
  filterListName:any;
  filterListValue:any;
  filterListValueOld:any;
  listHeader: any;
  filterId: any;
  filterName: any;
  listArr:any = [];
  filterListValues:any = [];
  realstate_company:any;
  multiSelect:boolean = false;
  goBack:boolean = false;
  partiesInfo:any;
  selectedProtocol:any;
  selectedProtocolId:any;
  currentProtocolName:any;
  unitTypes:any = [];
  relationIds:any = [];
  showFilterList:boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private storage: Storage,
    private router: Router,
    private TranslationService: TranslationService,
    public observableService: ObservableService,
    public service: SimpleService) {
    }

  ngOnInit() {
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
    }, 500);
    this.showFilterList = false;
    this.multiSelect = false;
    this.goBack = true;
    const currentProtocol = await this.storage.get('current_protocol');
    this.selectedProtocol = currentProtocol;
    this.selectedProtocolId = currentProtocol.id;
    this.currentProtocolName = currentProtocol.name;
    this.realstate_company = await this.storage.get('real_estate_company');
    this.filterListName = await this.storage.get('filter_list_name');
    if (this.filterListName == 'moving_in_id') {
      this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.moving_in_resident;
      this.listArr = await this.storage.get('residents');
      this.filterId = 'id';
      this.filterName = 'full_name';
    } else if (this.filterListName == 'relation_id') {
      this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.relations;
      this.listArr = await this.storage.get('relationsForResident');
      if (this.listArr.length == 1) {
          this.goBack = true;
      } else {
          this.goBack = false;
      }
      this.filterId = 'relation_id';
      this.filterName = 'displayRelationData';
      this.multiSelect = true;
      this.filterListValues = !!await this.storage.get('filter_list_values') ? await this.storage.get('filter_list_values') : [];
      this.listArr.forEach(list => {
        let checkedIndex = this.filterListValues.findIndex(filterList => filterList.relation_id == list.relation_id);
        if (checkedIndex == -1) {
          list.isChecked = false;
        } else {
          list.isChecked = true;
        }
      });
    } else if (this.filterListName == 'moving_out_id') {
      this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.moving_out_resident;
      if (this.selectedProtocolId == 5) {
          this.listArr = await this.storage.get('residents');
      } else {
          this.listArr = await this.storage.get('moving_outs');
      }
      this.filterId = 'id';
      this.filterName = 'full_name';
    } else if (this.filterListName == 'tu_gu_id') {
      this.listHeader =  this.TranslationService.translationsList.offline_tool.labels.tu_gu;
      this.listArr = await this.storage.get('tugu');
      this.filterId = 'id';
      this.filterName = 'tuguinfo';
    } else if (this.filterListName  == 'real_estate_company'){
      this.goBack = false;
      this.listHeader = this.TranslationService.translationsList.offline_tool.labels.realstate_company;
    } else if (this.filterListName  == 'house_owner'){
      this.goBack = false;
      this.listHeader = this.TranslationService.translationsList.offline_tool.labels.houseowner;
    } else if (this.filterListName  === 'quarter_id') {
        this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.quarter;
        this.listArr = await this.storage.get('quarters');
        this.filterId = 'id';
        this.filterName = 'name';
    } else if (this.filterListName  === 'building_id') {
        this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.building;
        const partiesInfo = await this.storage.get('parties_info');
        const listArr = await this.storage.get('buildings');
        this.listArr = listArr.filter(listItem => {
            listItem.street = listItem.street + ' ' + listItem.house_num;
            return listItem.quarter_id === partiesInfo.quarter_id;
        });
        this.filterId = 'id';
        this.filterName = 'street';
    } else if (this.filterListName  === 'unit_id') {
        this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.unit;
        const partiesInfo = await this.storage.get('parties_info');
        const units = await this.storage.get('units');
        const unitTypesNames = await this.storage.get('unit_types');
        this.listArr = units.filter(listItem => {
          let translatedUnitType = this.TranslationService.getTranslatedListValue(this.TranslationService.translationsList.units.type, listItem.type, unitTypesNames);
            listItem.displayUnitData = (!!listItem.name && listItem.name != '' ? listItem.name:'')  + (!!listItem.type && listItem.type!='' ?' -- '+ translatedUnitType:'');
            return listItem.building_id === partiesInfo.building_id && listItem.quarter_id === partiesInfo.quarter_id;
        });
        this.filterId = 'id';
        this.filterName = 'displayUnitData';
    } else if (this.filterListName  === 'service_provider') {
        this.listHeader = this.TranslationService.translationsList.offline_tool.placeholders.request.service_provider;
        this.listArr = await this.storage.get('service_providers');
        this.filterId = 'id';
        this.filterName = 'full_name';
    } else if (this.filterListName === 'resident') {
        this.listHeader =  this.TranslationService.translationsList.offline_tool.placeholders.residents;
        const partiesInfo = await this.storage.get('parties_info');
        if (this.selectedProtocolId == 3 && partiesInfo.unit_id !='') {
            let relations = await this.storage.get('relations');
            let resArr = relations.filter((rel) => {
                if(rel.unit_id == partiesInfo.unit_id && rel.quarter_id == partiesInfo.quarter_id && rel.building_id == partiesInfo.building_id) {
                    return rel;
                }
            });
            const listArr = await this.storage.get('residents');
            listArr.filter((list) => {
                resArr.forEach((val) => {
                    if (val.resident_id == list.id) {
                        this.listArr.push(list);
                    }
                });
            });
        } else {
            this.listArr = await this.storage.get('residents');
        }
        this.filterId = 'id';
        this.filterName = 'full_name';
    }
    if (!this.multiSelect) {
      this.filterListValue = await this.storage.get('filter_list_value');
      this.filterListValueOld = await this.storage.get('filter_list_value');
    } else {
      if (this.filterListValues.length > 0) {
        await this.storage.set('filter_list_values', this.listArr);
      }
    }
    this.showFilterList = true;
    const currentIndex = await this.storage.get('current_index');
    const submitData = await this.storage.get('submit_data');
    this.partiesInfo = await this.storage.get('parties_info');
    let links = await this.storage.get('links');
    links = this.observableService.modifyLinks(links, 2);
    if (currentIndex != -1) {
      if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
        if (!!submitData[currentIndex].parties.relation_ids) {
          let isModifiedRelation = false;
          if (this.partiesInfo.relation_ids.length == submitData[currentIndex].parties.relation_ids.length) {
            this.partiesInfo.relation_ids.map(currentRelation => {
              if (submitData[currentIndex].parties.relation_ids.indexOf(currentRelation) == -1) {
                isModifiedRelation = true;
              }
            });
          } else {
            isModifiedRelation = true;
          }
          if ((this.partiesInfo.moving_in_id != submitData[currentIndex].parties.moving_in_id || isModifiedRelation) || (this.partiesInfo.moving_out_id != submitData[currentIndex].parties.moving_out_id && this.selectedProtocolId == 5)){
            links = this.observableService.modifyLinks(links, 2);
          } else {
            links = this.observableService.modifyLinks(links, 2, submitData[currentIndex].rooms);
          }
        }
      } else {
        if (this.partiesInfo.quarter_id != submitData[currentIndex].parties.quarter_id || this.partiesInfo.building_id != submitData[currentIndex].parties.building_id || this.partiesInfo.unit_id != submitData[currentIndex].parties.unit_id){
          links = this.observableService.modifyLinks(links, 2);
        } else {
          links = this.observableService.modifyLinks(links, 2, submitData[currentIndex].rooms);
        }
      }
    }
    if (this.selectedProtocolId != 4 && this.selectedProtocolId != 5) {
      if (!!this.partiesInfo.unit_id &&  this.partiesInfo.unit_id != "") {
        links[2].name = this.TranslationService.translationsList.offline_tool.headings.rooms;
      } else {
        links[2].name = this.TranslationService.translationsList.offline_tool.labels.floors;
      }
    } else {
      links[2].name = this.TranslationService.translationsList.offline_tool.headings.rooms;
    }
    if (this.observableService.isRoomsChanged == true) {
      links = links.map(link => {
          if (link.id > 3) {
              link.enable = false;
          }
          return link;
      });
    }
    this.observableService.setLinks(links);
    await this.storage.set('links', links);
  }
  async validationOnFilterList(filterValues) {
    this.unitTypes = [];
    this.relationIds = [];
    filterValues.list.forEach(element => {
      if (element.isChecked) {
        this.unitTypes.push(element.type);
        this.relationIds.push(element);
      }
    });
    let relationTypeAllow:any;
    let relation = this.relationIds.find(item => item.relation_id == filterValues.selectedItem.relation_id);
    this.unitTypes.splice(this.relationIds.findIndex(item => item.relation_id == filterValues.selectedItem.relation_id), 1);
    if (!!relation) {
      if (this.unitTypes.includes(1) && relation.type == 2) {
        filterValues.selectedItem.isChecked = false;
        let index = filterValues.list.findIndex(item => item.relation_id == filterValues.selectedItem.relation_id);
        filterValues.list[index] = filterValues.selectedItem;
        relationTypeAllow = "private_type";
      } else if (this.unitTypes.includes(2) && relation.type == 1) {
        filterValues.selectedItem.isChecked = false;
        let index = filterValues.list.findIndex(item => item.relation_id == filterValues.selectedItem.relation_id);
        filterValues.list[index] = filterValues.selectedItem;
        relationTypeAllow = "business_type";
      } else if (this.unitTypes.length > 0 && this.unitTypes.includes(relation.type)) {
        filterValues.selectedItem.isChecked = false;
        let index = filterValues.list.findIndex(item => item.relation_id == filterValues.selectedItem.relation_id);
        filterValues.list[index] = filterValues.selectedItem;
        relationTypeAllow = "not_applicable";
      } else {
        relationTypeAllow = "allow";
      }
    } else {
      relationTypeAllow = "allow";
    }
    await this.storage.set('relationTypeAllow', relationTypeAllow);
    await this.storage.set('filter_list_values', filterValues.list);
  }
  async closeListSelector() {
    var currentIndex = await this.storage.get('current_index');
    var submitData = await this.storage.get('submit_data');
    let list = await this.storage.get('filter_list_values');
    const currentProtocol = await this.storage.get('current_protocol');
    this.partiesInfo = await this.storage.get('parties_info');

    if (this.filterListName !='real_estate_company' && this.filterListName !='house_owner') {
      this.filterListValue = await this.storage.get('filter_list_value');

        if (currentIndex !== -1) {
          this.observableService.partiesInfoChanged = true;
            if (this.filterListName === 'quarter_id' && (currentProtocol.id === 1 || currentProtocol.id === 2 || currentProtocol.id === 3)) {
                if (this.filterListValue !== submitData[currentIndex].parties.quarter_id) {
                    this.partiesInfo.building_id = '';
                    this.partiesInfo.unit_id = '';
                  //  this.partiesInfo.resident = '';
                }
            }

            if (this.filterListName === 'building_id' && (currentProtocol.id === 1 || currentProtocol.id === 2 || currentProtocol.id === 3)) {
                if (this.filterListValue !== submitData[currentIndex].parties.building_id) {
                    this.partiesInfo.unit_id = '';
                 //   this.partiesInfo.resident = '';
                }
            }
        } else {
            if (this.filterListName === 'quarter_id' && (currentProtocol.id === 1 || currentProtocol.id === 2 || currentProtocol.id === 3)) {
                if (this.filterListValue !==  this.partiesInfo.quarter_id) {
                    this.partiesInfo.building_id = '';
                    this.partiesInfo.unit_id = '';
                   //    this.partiesInfo.resident = '';
                }
            }

            if (this.filterListName === 'building_id' && (currentProtocol.id === 1 || currentProtocol.id === 2 || currentProtocol.id === 3)) {
                if (this.filterListValue !==  this.partiesInfo.building_id) {
                    this.partiesInfo.unit_id = '';
                  //  this.partiesInfo.resident = '';
                }
            }
        }

      if (this.filterListName == 'moving_in_id') {
        if (this.filterListValue !==  this.partiesInfo.moving_in_id) {
          this.partiesInfo.relation_id = "";
          this.partiesInfo.moving_out_id = "";
          this.partiesInfo.relation_ids = [];
          this.filterListValues = [];
        }
      } else if (this.filterListName == 'moving_out_id' && this.selectedProtocolId == 5) {
        if (this.filterListValue !==  this.partiesInfo.moving_out_id) {
          this.partiesInfo.relation_id = "";
          this.partiesInfo.relation_ids = [];
          this.filterListValues = [];
        }
      } else if (this.filterListName == 'relation_id') {
        this.filterListValues = list.filter(listItem => {
          return listItem.isChecked == true;
        });
        if (this.selectedProtocolId != 5) {
          if (this.partiesInfo.relation_ids.length == this.filterListValues.length) {
            this.filterListValues.map(currentRelation => {
              if (this.partiesInfo.relation_ids.indexOf(currentRelation.relation_id) == -1) {
                this.partiesInfo.moving_out_id = "";
              }
            });
          } else {
            this.partiesInfo.moving_out_id = "";
          }
        }
        this.partiesInfo.relation_ids = [];
        if (this.filterListValues.length > 0) {
          this.partiesInfo.relation_id = this.filterListValues[0].relation_id;
          this.filterListValues.forEach(listValue => {
            this.partiesInfo.relation_ids.push(listValue.relation_id);
          });
        } else {
          this.partiesInfo.relation_id = '';
        }
        await this.storage.set('filter_list_values', this.filterListValues);
      }
    }
    if (this.filterListName != 'relation_id') {
      this.partiesInfo[this.filterListName] = this.filterListValue;
    }

    await this.storage.set('filter_list_value', this.filterListValue);
    await this.storage.set('parties_info', this.partiesInfo);
    this.router.navigate(['/parties']);
  }
  checkAndGoToParties() {
      if ((this.filterListName == 'real_estate_company' || this.filterListName == 'house_owner') && this.filterListValue != this.filterListValueOld) {
          this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
              this.goToParties();
          });
      } else {
          this.goToParties();
      }
  }
  async goToParties() {
    if (!!this.partiesInfo.relation_ids) {
      this.filterListValues = [];
      let list = await this.storage.get('filter_list_values');
      if (this.partiesInfo.relation_ids.length == 0) {
        this.filterListValues = [];
      } else {
        list.map(currentRelation => {
          if (this.partiesInfo.relation_ids.indexOf(currentRelation.relation_id) != -1) {
            this.filterListValues.push(currentRelation);
          }
        });
      }
      await this.storage.set('filter_list_values', this.filterListValues);
    }
    this.router.navigate(['/parties']);
  }
}
