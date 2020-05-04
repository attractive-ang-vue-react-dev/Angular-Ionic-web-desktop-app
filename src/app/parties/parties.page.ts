import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleService } from '../api/simple-service.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { ObservableService } from '../api/observable.service';
import { DatePipe } from '@angular/common';

declare let require: any
let mergeJSON = require("merge-json") ;

@Component({
  selector: 'app-parties',
  templateUrl: './parties.page.html',
  styleUrls: ['./parties.page.scss'],
})
export class PartiesPage implements OnInit {
  serviceProviders: any = [];
  buildingData: any = [];
  inResidentUser: any = [];
  relations: any = [];
  units: any = [];
  quartersData: any = [];
  getRelationFilter: any = [];
  getBuildingFilter: any = [];
  residentId: any;
  getMovingOut: any = [];
  setOutUser: any = [];
  selectedProtocol: any;
  selectedProtocolId: any;
  miscellaneousTranslateKey: any;
  quarterId: any;
  buildingId: any;
  currentProtocolName: any;
  relationsForResident: any = [];
  movingOuts: any = [];
  tugu: any = [];
  unitTypeNames: any;
  partiesInfo: any = {'moving_in_id':'','relation_id':'','quarter_id':'','building_id':'','unit_id':'','moving_out_id':'','tu_gu_id':'','house_owner':'','real_estate_company':'', 'resident': '', 'unit': '', 'relation_ids':[], 'unit_ids':[]};
  unitTypes: any = [];
  relationIds: any = [];
  movingInName: any;
  buildingName: any;
  serviceProviderName: any;
  unitName: any;
  quarterName: any;
  tuguName: any;
  movingOutName: any;
  relationNames: any;
  residentName: any;
  filterListValues: any = [];
  relationsStatus: any = [];
  card: any;
  request_data: any;
  relationUpdated: boolean = false;
  constructor(
    private storage: Storage,
    private router: Router,
    public simpleService: SimpleService,
    public translate: TranslateService,
    public translationService: TranslationService,
    public observableService: ObservableService,
    public datePipe: DatePipe
    ) {}

  async ngOnInit() {
    const currentProtocol = await this.storage.get('current_protocol');
    this.selectedProtocol = currentProtocol;
    this.selectedProtocolId = currentProtocol.id;
    this.currentProtocolName = currentProtocol.name;
    this.storage.get('relationsForResident').then((val) => {
      if (val) {
        this.relationsForResident = val;
      }
    });

    this.storage.get('tugu').then((val) => {
      if (val) {
        this.tugu = val;
      }
    });

    this.storage.get('relations').then((val) => {
      if (val) {
        this.relations = val;
      }
    });
    this.storage.get('relations_Status').then((val) => {
      if (val) {
        this.relationsStatus = val;
      }
    });

    this.storage.get('buildings').then((val) => {
      if (val) {
        this.buildingData = val;
      }
    });
    this.storage.get('quarters').then((val) => {
      if (val) {
        this.quartersData = val;
      }
    });
    this.storage.get('service_providers').then((val) => {
      if (val) {
        this.serviceProviders = val;
      }
    });

    this.storage.get('units').then((val) => {
      if (val) {
        this.units = val;
      }
    });

    this.storage.get('residents').then((val) => {
      if (val) {
        this.inResidentUser = val;
      }
    });

    this.storage.get('quarters').then((val) => {
      if (val) {
        this.quartersData = val;
      }
    });

    this.storage.get('settings').then((val) => {
      if (val) {
        if (this.selectedProtocolId == 2 || this.selectedProtocolId == 3) {
          this.partiesInfo.real_estate_company = '';
        } else {
          this.partiesInfo.real_estate_company = val.name + ', ' + val.street + ', ' + val.zip + ' ' + val.city;
        }
      }
    });

    this.storage.get('house_owners').then((val) => {
      if (val) {
        this.partiesInfo.house_owner = val[0].company_name + ', ' + val[0].street + ' ' + val[0].house_num + ', ' + val[0].zip + ' ' + val[0].city;

      }
    });
    this.storage.get('unit_types').then((val) => {
      if (val) {
        this.unitTypeNames = val;

      }
    });

    await this.storage.set('BuildingsByQuarter', []);
    await this.storage.set('UnitsByQuarterAndBuilding', []);

  }
  async getFullNameById() {
    await this.storage.set('filter_list_values', this.filterListValues);
    if (this.partiesInfo.quarter_id && this.partiesInfo.quarter_id != '') {
        let quarter = this.quartersData.filter(item => item.id == this.partiesInfo.quarter_id)[0]
        this.quarterName = quarter.name;
        this.card['quarter_name'] = this.quarterName;
        this.card['internal_quarter_id'] = quarter.internal_quarter_id;
    }
    if (this.partiesInfo.building_id && this.partiesInfo.building_id != '') {
        let building =  this.buildingData.filter(item => item.id == this.partiesInfo.building_id);
        this.buildingName = building[0].street + ' ' + building[0].house_num;
        this.card['building_name'] = this.buildingName;
    } else {
        this.buildingName = '';
    }
    if (this.partiesInfo.service_provider && this.partiesInfo.service_provider != '') {
        this.serviceProviderName = this.serviceProviders.filter(item => item.id == this.partiesInfo.service_provider)[0] ;
        this.serviceProviderName = this.serviceProviderName.first_name + ' ' + this.serviceProviderName.last_name;
    } else {
        this.serviceProviderName = '';
    }
    if (this.partiesInfo.unit_id != '' && !!this.partiesInfo.unit_id) {
        this.unitName = this.units.filter(item => item.id == this.partiesInfo.unit_id)[0].name;
        this.card['unit'] = this.unitName;
    } else {
        this.unitName = '';
    }
    if (this.partiesInfo.resident && this.partiesInfo.resident != '') {
        this.residentName = this.inResidentUser.filter(resident => resident.id == this.partiesInfo.resident)[0].full_name;
        this.card['residentName'] = this.residentName;
    } else {
        this.residentName = '';
    }
    if (this.partiesInfo.moving_in_id == "" || !this.partiesInfo.moving_in_id) {
      this.movingInName = "";
    } else {
      this.inResidentUser.map(resident => {
        if (resident.id == this.partiesInfo.moving_in_id) {
          this.movingInName = resident.full_name;
          this.card['moving_in_name'] = this.movingInName;
        }
      });
    }
    if (this.partiesInfo.moving_out_id == "" || !this.partiesInfo.moving_out_id) {
      this.movingOutName = "";
    } else {
        if(this.selectedProtocolId == 5) {
            this.inResidentUser.map(resident => {
                if (resident.id == this.partiesInfo.moving_out_id) {
                    this.movingOutName = resident.full_name;
                    this.card['moving_out_name'] = this.movingOutName;
                }
            });
        } else {
            this.setOutUser.map(outUser => {
                if (outUser.id == this.partiesInfo.moving_out_id) {
                    this.movingOutName = outUser.full_name;
                    this.card['moving_out_name'] = this.movingOutName;
                }
            });
        }
    }
    if (this.partiesInfo.tu_gu_id == "" || !this.partiesInfo.tu_gu_id) {
      this.tuguName = "";
    } else {
      this.tugu.map(tugu => {
        if (tugu.id == this.partiesInfo.tu_gu_id) {
          this.tuguName = tugu.first_name + ' ' + tugu.last_name;
        }
      });
    }
    this.relationNames = "";
    if (this.partiesInfo.relation_id != "" && !!this.partiesInfo.relation_id) {
      if (this.filterListValues.length > 0) {
        this.relationNames = this.filterListValues.map((relation,index) => {
          return relation.name;
        }).join(", ");
      }
        let quarter = this.quartersData.filter(item => item.id == this.filterListValues[0].quarter_id)[0]
        this.quarterName = quarter.name;
        this.card['quarter_name'] = quarter.name;
        this.card['internal_quarter_id'] = quarter.internal_quarter_id;

      this.card['units'] = this.relationNames.split(", ");
    }
  }
  setUnitDataInRelations(newRelations, newRelationsData) {
    newRelationsData.map(relation => {
      let translatedUnitStatus;
      this.units.map(unit => {
        if (unit.id == relation.unit_id && unit.building_id == relation.building_id) {
          this.quartersData.map(quarter => {
            if(unit.quarter_id == quarter.id ) {
              let translatedUnitType = this.translationService.getTranslatedListValue(this.translationService.translationsList.units.type, unit.type, this.unitTypeNames);
              if ( this.selectedProtocolId == 4 || (this.selectedProtocolId == 5 && (relation.status == 1 || relation.status == 3))) {
                translatedUnitStatus = this.translationService.getTranslatedListValue(this.translationService.translationsList.relations.status, relation.status, this.relationsStatus);
                unit = { ...unit, internal_quarter_id: quarter.internal_quarter_id, relation_id: relation.id, translated_unit_type: translatedUnitType, status: relation.status , translated_unit_status: translatedUnitStatus}
              }
            }
          });
          if (!!translatedUnitStatus) {
            newRelations.push(unit);
          }
        }
      });
    });
    newRelations = newRelations.map(item => {
      // +  (!!item.room_no?' -- '+item.room_no:'' )
      if(item.room_no != 0) { item = { ...item, displayRelationData: (!!item.internal_quarter_id?item.internal_quarter_id:'')  + ' ' + (!!this.miscellaneousTranslateKey?this.miscellaneousTranslateKey:'') + ' -- ' +(!!item.name?item.name:'') + ' -- '+ (!!item.floor_label?item.floor_label:'')  + ' -- ' + (!!item.translated_unit_type?item.translated_unit_type:'') + ' -- ' + (!!item.translated_unit_status ? item.translated_unit_status :'')}}
      else { item = { ...item, displayRelationData: (!!item.internal_quarter_id?item.internal_quarter_id:'')   + ' -- ' + (!!item.name?item.name:'') + (!!item.floor_label?' -- '+item.floor_label:'')+ ' -- ' + (!!item.translated_unit_type?item.translated_unit_type:'') + ' -- ' + (!!item.translated_unit_status ? item.translated_unit_status:'')}}
      return item;
    });
    return newRelations;
  }
  async ionViewWillEnter() {
    const loginDetails = await this.storage.get('login_detail');
      if (!await this.storage.get('loaderToShow')) {
          await this.simpleService.showLoader();
      }
      this.card = {
        completed: false,
        isSynced : false,
        active: false,
        created_at: new Date(),
        user_id: loginDetails.user_id
      };
      const currentProtocol = await this.storage.get('current_protocol');
      this.selectedProtocol = currentProtocol;
      this.selectedProtocolId = currentProtocol.id;
      this.currentProtocolName = currentProtocol.name;
      this.unitTypes = [];
      this.translationService.getTranslations();
      const currentIndex = await this.storage.get('current_index');
      const filterListName = await this.storage.get('filter_list_name');
      this.filterListValues = await this.storage.get('filter_list_values');
      const partiesInfoStorage = await this.storage.get('parties_info');
      const submitData = await this.storage.get('submit_data');
      if (currentIndex != -1) {
        this.filterListValues = [];
        const currentSession = submitData[currentIndex];
        if (!!partiesInfoStorage) {
          this.partiesInfo = partiesInfoStorage;
        } else {
          this.partiesInfo = currentSession.parties;
        }
        this.getRelationsFromResident();
        this.setOutUser = this.inResidentUser.filter(item => item.id == this.partiesInfo.moving_out_id);
        await this.storage.set('moving_outs', this.setOutUser);
        if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
            if (this.partiesInfo.relation_ids) {
              this.partiesInfo.relation_ids.map(relationId => {
                    let isRelationMatched = this.getRelationFilter.find(item => item.relation_id == relationId);
                    if (!!isRelationMatched) {
                      this.filterListValues.push(isRelationMatched);
                      this.unitTypes.push(isRelationMatched.type);
                    }
                });
            }
        }
     } else {
      let settings = await this.storage.get('settings');
      let real_estate_company = settings.name + ', ' + settings.street + ', ' + settings.zip + ' ' + settings.city;
      let house_owners = await this.storage.get('house_owners');
      let house_owner = house_owners[0].company_name + ', ' + house_owners[0].street + ' ' + house_owners[0].house_num + ', ' + house_owners[0].zip + ' ' + house_owners[0].city;
      if (!partiesInfoStorage) {
        this.partiesInfo = {
          moving_in_id: '',
          relation_id: '',
          moving_out_id: '',
          unit_id: '',
          building_id: '',
          quarter_id: '',
          tu_gu_id: '',
          house_owner: house_owner,
          service_provider: '',
          real_estate_company: real_estate_company,
          relation_ids: [],
          unit_ids: []
        }
        this.movingInName = '';
        this.buildingName = '';
        this.quarterName = '';
        this.unitName = '';
        this.tuguName = '';
        this.movingOutName = '';
        this.relationNames = '';
        this.serviceProviderName = '';
        this.residentName = '';
      }
     }
      if (!!partiesInfoStorage) {
        this.partiesInfo = partiesInfoStorage;
        if (filterListName != 'house_owner' && filterListName != 'real_estate_company') {
          this.getRelationsFromResident();
          this.getMovingOutsFromRelation();
        }
      }
      setTimeout(async () => {
        this.getFullNameById();
      }, 200);
      let links = await this.storage.get('links');
      if (currentIndex != -1 && this.observableService.partiesInfoChanged == true) {
        if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
          if (!!submitData[currentIndex].parties.relation_ids) {
            if (((this.partiesInfo.moving_in_id != submitData[currentIndex].parties.moving_in_id && this.selectedProtocolId == 4 ) || (this.partiesInfo.moving_out_id != submitData[currentIndex].parties.moving_out_id && this.selectedProtocolId == 5)) || (this.isRelationModifies(submitData[currentIndex].parties.relation_ids)  === true )){
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
      } else if (currentIndex != -1 && this.observableService.partiesInfoChanged != true) {
        links = this.observableService.modifyLinks(links, 2, submitData[currentIndex].rooms);
      } else {
        links = this.observableService.modifyLinks(links, 2);
      }
      if (this.selectedProtocolId != 4 && this.selectedProtocolId != 5) {
        if (!!this.partiesInfo.unit_id &&  this.partiesInfo.unit_id != "") {
          links[2].name = this.translationService.translationsList.offline_tool.headings.rooms;
        } else {
          links[2].name = this.translationService.translationsList.offline_tool.labels.floors;
        }
      } else {
        links[2].name = this.translationService.translationsList.offline_tool.headings.rooms;
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
      await this.storage.set('parties_info', this.partiesInfo);
      await this.simpleService.hideLoader();
  }
  isRelationModifies(relationIds) {
    let isModifiedRelation = false;
    if (this.partiesInfo.relation_ids.length == relationIds.length) {
      this.partiesInfo.relation_ids.map(currentRelation => {
        if (relationIds.indexOf(currentRelation) == -1) {
          isModifiedRelation = true;
        }
      });
    } else {
      isModifiedRelation = true;
    }
    return isModifiedRelation;
  }
   async getMovingOutsFromRelation() {
    await this.storage.set('moving_outs', '');

    this.getMovingOut = [];
    this.setOutUser = [];
    let flag = 0;
    let currentRelation;
    if (this.getRelationFilter.length > 0) {
      this.getRelationFilter.map(item => {
        if (this.partiesInfo.relation_id == item.relation_id) {
          currentRelation = item;
        }
      });
    }
    
    this.getRelationFilter.map(item => {
      if (item.relation_id == this.partiesInfo.relation_id) {
        this.relations.map(relation => {
          if (relation.quarter_id == item.quarter_id && relation.unit_id == item.id && relation.resident_id != this.partiesInfo.moving_in_id) {
            this.getMovingOut.push(relation);
          }
        });
      }
    });

    this.getMovingOut.map(moving_out => {
      this.inResidentUser.map(resident => {
        if (moving_out.resident_id == resident.id) {this.setOutUser.push(resident)}
      });
    });

   await this.storage.set('moving_outs', this.setOutUser);
  }

  async getRelationsFromResident() {
    this.residentId = '';
    let newRelationsData: any = [];
    let newRelations: any = [];
    if (this.partiesInfo.moving_in_id != "" && this.selectedProtocolId ==4) {
      this.residentId = this.partiesInfo.moving_in_id;
    }
    if (this.partiesInfo.moving_out_id != "" && this.selectedProtocolId ==5) {
      this.residentId = this.partiesInfo.moving_out_id;
    }
    this.relations.map(item => {
      if (item.resident_id == this.residentId) {
        newRelationsData.push(item);
      }
    });
    newRelations = this.setUnitDataInRelations(newRelations , newRelationsData);
    await this.storage.set('relationsForResident', newRelations);
    this.getRelationFilter = newRelations;
  }
  async openListSelector(filterListName) {
    await this.storage.set('filter_list_name', filterListName);
    await this.storage.set('parties_info', this.partiesInfo);
    await this.storage.set('filter_list_value', this.partiesInfo[filterListName]);
    this.router.navigate(['/parties-inner']);
  }

  addRoomsRelationIdUnitId(rooms, movingInId) {
    let newRelationsData = [];
    this.relations.map(item => {
      if(item.resident_id == movingInId) {
        newRelationsData.push(item);
      }
    });
    newRelationsData.map(relation => {
      let relationIndex = this.partiesInfo.relation_ids.indexOf(relation.id);
      if (relationIndex != -1) {
        this.units.map(unit => {
          if (unit.id == relation.unit_id) {
            rooms.map(room => {
              if (unit.type == room.unit_type ) {
                room.relation_id = relation.id;
                room.unit_id = relation.unit_id;
                room.full_url = !!unit.latest_plan ? unit.latest_plan.full_url : null;
                room.plan_id = !!unit.latest_plan ? unit.latest_plan.id : "";
                room.showDelete = true;
              }
            });
          }
        });
      }
    });
    rooms.map(item => {
      delete item.unit_type;
    });
    return rooms;
  }
   getSelectedRooms(unitTypes, rooms, catalog_protocol_type, catalog_room_floor, all_rooms) {  
    unitTypes.map(unitType => {
      let selectedCatelogType = catalog_protocol_type.find(item => item.protocol_type_id == this.selectedProtocolId && item.unit_type == unitType);
        if (!!selectedCatelogType) {
          let catalog_id = selectedCatelogType.catalog_id;
          let rooms_modified = catalog_room_floor.filter(item => item.catalog_id == catalog_id);
          rooms_modified.map(modified_item => {
              let roomIndex = rooms.findIndex(item => item.id == modified_item.room_id);
              if (roomIndex == -1) {
                  all_rooms.map(item => {
                      if(modified_item.room_id == item.id) {
                        if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
                          item.unit_type = unitType;
                        }
                        item.showDelete = true;
                        rooms.push(item);
                      }
                  });
              }
          });
        }
        
    });
    return rooms;
  }
  async goToRoom() {
      let currentProtocolAttributes:any = [];
      if (this.selectedProtocolId == 1 || this.selectedProtocolId == 2 || this.selectedProtocolId == 3) {
          currentProtocolAttributes.push('quarter_id'); 	
          currentProtocolAttributes.push('building_id');
      } else {
          currentProtocolAttributes.push('house_owner');
          currentProtocolAttributes.push('real_estate_company');
          currentProtocolAttributes.push('relation_ids');
          if (this.selectedProtocolId == 4) {
              currentProtocolAttributes.push('moving_in_id');
          } else {
              currentProtocolAttributes.push('moving_out_id');
          }
      }
      let isEmpty:boolean = false;
      currentProtocolAttributes.map(attribute => {
          if (this.partiesInfo[attribute] == '' || this.partiesInfo[attribute].length == 0) {
              isEmpty = true;
          }
    });
    if (isEmpty) {
      this.simpleService.presentAlertWithSingle(this.translationService.translationsList.offline_tool.messages.Please_fill_all_required_fields);
    } else {
      this.observableService.partiesInfoChanged = false;
      this.simpleService.showLoader(this.translationService.translationsList.offline_tool.messages.please_wait);
    //  setTimeout(async () => {
       // this.simpleService.hideLoader();
        let catalog_protocol_type = await this.storage.get('catalog_protocol_type');
        let catalog_room_floor = await this.storage.get('catalog_room_floor');
        let all_rooms = await this.storage.get('rooms');
        let submitData = await this.storage.get('submit_data');
        let currentIndex = await this.storage.get('current_index');
        this.filterListValues.map(element => {
            this.unitTypes.push(element.type);
            this.unitTypes.sort();
        });
        let rooms:any = [];
        let floors:any = [];
        if (submitData == null || submitData.length == 0) {
            submitData = [];
        }
        let currentPartiesInfo: any = {};
        if (currentIndex == -1) {
          let partiesArr: any;
            partiesArr = {
                house_owner: ''
            };
            if (this.selectedProtocolId == 1 ||
               ((this.selectedProtocolId == 2 || this.selectedProtocolId == 3)/* && this.partiesInfo.unit_id == ''*/)) {
                partiesArr.unit_id = '',
                partiesArr.quarter_id = '';
                partiesArr.tu_gu_id = '';
                partiesArr.building_id = '';
                if (this.selectedProtocolId === 1) {
                  partiesArr.service_provider = '';
                } else if (this.selectedProtocolId === 3) {
                  partiesArr.resident = '';
                }
            } else {
                partiesArr.relation_id = '';
                if (this.selectedProtocolId === 4 || this.selectedProtocolId === 5) {
                    partiesArr.real_estate_company = '';
                    partiesArr.relation_ids = [];
                    partiesArr.unit_ids = [];
                    if (this.selectedProtocolId === 4) {
                        partiesArr.moving_in_id = '';
                        partiesArr.moving_out_id = '';
                        partiesArr.tu_gu_id = '';
                    } else {
                        partiesArr.moving_out_id = '';
                    }
                }
            }
          let conclusionDate = new Date().toISOString();
          
          let currentSession = {
            protocol_type: {
                id: '',
                name: ''
            },
            parties: partiesArr,
            rooms: rooms,
            floors: floors,
            new_room_types: [],
            miscellaneous: {
                key: [],
                general: [],
                general_note: '',
            },
            conclusion: {
                city: '',
                date: this.datePipe.transform(conclusionDate, 'dd.MM.yyyy'),
                signature: {}
            }
        };
          currentPartiesInfo = currentSession;
        } else {
          currentPartiesInfo = submitData[currentIndex];
        }
        let currentSelectedCity;
        if (this.partiesInfo.tu_gu_id !== '' && currentPartiesInfo.conclusion.signature.hasOwnProperty('tu_gu') === false) {
          currentPartiesInfo.conclusion.signature.tu_gu = '';
        }
        switch (this.selectedProtocolId) {
          case 1:
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('house_owner') === false) {
              currentPartiesInfo.conclusion.signature.house_owner = '';
            }
            if (this.partiesInfo.service_provider !== '' && currentPartiesInfo.conclusion.signature.hasOwnProperty('service_provider') === false) {
              currentPartiesInfo.conclusion.signature.service_provider = '';
            }
            break;
          case 2:
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('house_owner') === false) {
              currentPartiesInfo.conclusion.signature.house_owner = '';
            }
            break;
          case 3:
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('house_owner') === false) {
              currentPartiesInfo.conclusion.signature.house_owner = '';
            }
            if (!!this.partiesInfo.resident && this.partiesInfo.resident !== '' && currentPartiesInfo.conclusion.signature.hasOwnProperty('resident') === false) {
              currentPartiesInfo.conclusion.signature.resident = '';
            }
            break;
          case 4:
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('incoming') === false) {
              currentPartiesInfo.conclusion.signature.incoming = '';
            }
            if (this.partiesInfo.moving_out_id !== '' && currentPartiesInfo.conclusion.signature.hasOwnProperty('outgoing') === false) {
              currentPartiesInfo.conclusion.signature.outgoing = '';
            }
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('real_estate_company') === false) {
              currentPartiesInfo.conclusion.signature.real_estate_company = '';
            }
            break;
          case 5:
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('outgoing') === false) {
              currentPartiesInfo.conclusion.signature.outgoing = '';
            }
            if (currentPartiesInfo.conclusion.signature.hasOwnProperty('real_estate_company') === false) {
              currentPartiesInfo.conclusion.signature.real_estate_company = '';
            }
            break;
        }
        if (this.selectedProtocolId == 1 || this.selectedProtocolId == 2 || this.selectedProtocolId == 3) {
          rooms = [];
          if (this.partiesInfo.unit_id != '') {
              if (this.partiesInfo.unit_id != currentPartiesInfo.parties.unit_id) {
                  const unitType = this.units.filter(unit => unit.id == this.partiesInfo.unit_id)[0].type;
                  rooms = this.getSelectedRooms([unitType], rooms, catalog_protocol_type, catalog_room_floor, all_rooms);
                  currentPartiesInfo.rooms = rooms;
                  currentPartiesInfo.floors = floors;
              }
              const locationUnit = this.units.filter(unit => unit.id == this.partiesInfo.unit_id);
              if (locationUnit) {
                  if (locationUnit[0].latest_plan) {
                    await  this.storage.set('latestPlan', {
                          full_url : locationUnit[0].latest_plan.full_url,
                          plan_id: locationUnit[0].latest_plan.id
                      });
                  } else {
                    await  this.storage.set('latestPlan', null);
                  }
              } else {
                await this.storage.set('latestPlan', null);
              }
              if (this.selectedProtocolId == 1) {
                  rooms.map(room => {
                      delete room.components;
                      delete room.done;
                      delete room.complete_count;
                      delete room.components_count;
                      room.showDelete = true;
                      return room;
                  });
              }
          } else {
              if (this.partiesInfo.building_id != currentPartiesInfo.parties.building_id || this.partiesInfo.unit_id != currentPartiesInfo.parties.unit_id) {
                const buildingData = await this.storage.get('buildings');
                const currentFloors = buildingData.filter(building => building.id == this.partiesInfo.building_id)[0].floors;
                const floorsData = await this.storage.get('floors');
                const buildings = await this.storage.get('buildings');
                floors = floorsData.filter((floor) => {
                    if (currentFloors.indexOf(floor.id) > -1) {
                        buildings.map(building => {
                            if (building.id == this.partiesInfo.building_id) {
                                if (building.latest_plans.hasOwnProperty(floor.id)) {
                                    floor.plan_id =  building.latest_plans[floor.id].id;
                                    floor.plan_full_url = building.latest_plans[floor.id].full_url;
                                }
                            }
                        });
                        floor.showDelete = true;
                        return floor;
                    }
                });
                 currentPartiesInfo.floors = floors;
              }
          }
          currentSelectedCity = this.quartersData.find(item => item.id == this.partiesInfo.quarter_id).city;
        }
        if (this.selectedProtocolId == 4 || this.selectedProtocolId == 5) {
            this.relationUpdated = false;
            if (currentIndex == -1 || this.isRelationModifies(currentPartiesInfo.parties.relation_ids)  === true ) {
                this.relationUpdated = true;
                currentPartiesInfo.miscellaneous.key = [];
                currentPartiesInfo.miscellaneous.general = [];
                rooms = this.getSelectedRooms(this.unitTypes, rooms, catalog_protocol_type, catalog_room_floor, all_rooms);
                if (currentIndex != -1) {
                  let newRooms:any = [];
                  rooms.map(room => {
                    let relationIndex = -1;
                    let roomIndex = -1;
                    currentPartiesInfo.rooms.map((inspectedRoom, index) => {
                      if (inspectedRoom.id == room.id) {
                        roomIndex = index;
                        relationIndex = this.partiesInfo.relation_ids.indexOf(inspectedRoom.relation_id);
                      }
                    });
                    if (relationIndex != -1) {
                        currentPartiesInfo.rooms[roomIndex].unit_type = room.unit_type;
                        newRooms.push(currentPartiesInfo.rooms[roomIndex]);
                    } else {
                      newRooms.push(room);
                    }
                    room.showDelete = true;
                    return room;
                });
                  rooms = newRooms;
                }
                let residentId;
                residentId = this.selectedProtocolId == 4 ? this.partiesInfo.moving_in_id : this.partiesInfo.moving_out_id;
                rooms = this.addRoomsRelationIdUnitId(rooms, residentId);
                currentPartiesInfo.rooms = rooms;
            }
            this.getRelationsFromResident();
            let unitIds:any = [];
            let relationIds:any = [];
            let cities:any = [];
            let city:any = "";
            this.relations.map((relationFilter, index) => {
                let relation = this.filterListValues.find(item => item.relation_id == relationFilter.id);
                if (!!relation) {
                    relationIds.push(relation.relation_id);
                    unitIds.push(relation.id);
                    let currentRelationCity = this.quartersData.find(item => item.id == relation.quarter_id).city;
                    let index = cities.indexOf(currentRelationCity);
                    index == -1 ? cities.push(currentRelationCity) : '';
                }
            });
            city = cities.join(", ");
            currentSelectedCity = city;
            currentPartiesInfo.parties.unit_ids = unitIds;
            this.partiesInfo.unit_ids = unitIds;

            if (currentIndex == -1 || this.relationUpdated  === true ) {
              const oldRequests = await this.storage.get('requests');
              currentPartiesInfo.parties.unit_ids.forEach((val) => {
              if (typeof oldRequests === 'object' && oldRequests && oldRequests.length > 0) {
                const requestFiltered = oldRequests.filter((req) => {
                  if (req.unit_id == val && req.protocol_type == this.selectedProtocolId) {
                    return true;
                  }
                  return false;
                });
                if (requestFiltered.length > 0) {
                  requestFiltered.forEach(async (reqData) => {
                    currentPartiesInfo.rooms.forEach(async (room) => {
                      if (room.id == reqData.room_id) {
                        room.components.forEach(async (component) => {
                          if (component.id == reqData.component_id) {
                            if (!component.hasOwnProperty('request')) {
                              if (!room.hasOwnProperty('complete_count')) {
                                room.complete_count = 0;
                              }
                              if (!room.hasOwnProperty('done')) {
                                room.done = 0;
                              }
                              if (!room.hasOwnProperty('ok_count')) {
                                room.ok_count = 0;
                              }
                              if (!room.hasOwnProperty('not_ok_count')) {
                                room.not_ok_count = 0;
                              }
                              let request = {};
                                /*let currentRelation = this.filterListValues.find(item => item.relation_id == reqData.relation_id);
                              /*let full_url = '';
                                if (currentRelation && (reqData.hasOwnProperty('plan_id') && reqData.plan_id != '' && reqData.plan_id != null)) {
                                  if (currentRelation.hasOwnProperty('latest_plan') && currentRelation.hasOwnProperty('full_url')) {
                                    full_url = currentRelation.latest_plan.full_url;
                                  }
                                }*/
                              await this.updateRequestData(reqData.category_id, request, reqData, component, room);
                            }
                          }
                        });
                        room.components.sort((a, b) => {
                          return b.complete - a.complete;
                        });
                      }
                    });
                  });
                }
              }
            });
          }
        }
        currentPartiesInfo.conclusion.city = currentSelectedCity;
        Object.keys(this.selectedProtocol).map(key1 => {
          currentPartiesInfo.protocol_type[key1] = this.selectedProtocol[key1] || '';
        });
        Object.keys(currentPartiesInfo.parties).map(key2 => {
          currentPartiesInfo.parties[key2] = this.partiesInfo[key2] || '';
        });
        currentPartiesInfo.card = this.card;
        if (currentIndex == -1) {
            submitData.push(currentPartiesInfo);
            await this.storage.set('current_index', submitData.length - 1);
        } else {
            submitData[currentIndex] = currentPartiesInfo;
        }
        await this.storage.set('submit_data', submitData);
        this.router.navigate(['/rooms']);
    }
  }
  async updateRequestData(request_category, request, reqData, component, room) {
      let images = [];
      if (reqData.inspection_images.length > 0) {
          reqData.inspection_images.forEach((img) => {
          images.push({img: img});
        });
      }
      request = {
          title: reqData.title,
          request_id: reqData.id,
          description: reqData.description,
          inspection_images: images,
          plan_location: reqData.plan_location,
          plan_id: reqData.plan_id
      };
      if (request_category === 2 || request_category === 3 || request_category === 4) {
          request.service_provider = reqData.service_provider_id;
          request.cost_by = reqData.cost_by;
      }
      if (request_category === 2) {
          request.action = reqData.action;
      }
      component.request = request;
      component.complete = true;
      component.category_id = request_category;
      if (request_category == 2) {
          room.not_ok_count++;
      } else {
          room.ok_count++;
      }
      room.complete_count++;
      room.done++;
      if (room.complete_count == room.components_count) {
          room.complete = true;
      }
  }
}
