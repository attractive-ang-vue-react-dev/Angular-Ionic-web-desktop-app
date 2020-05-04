import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { SimpleService } from 'src/app/api/simple-service.service';
import { TranslationService } from '../../api/translation.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnInit, OnDestroy {
  @ViewChild('search1', { static: false })
  search1: IonSearchbar;
  @Input() list:any = [];
  @Input() filteredList:any = [];
  @Input() filterListValue: any;
  @Input() filterId: any;
  @Input() filterName: any;
  @Input() multiSelect: boolean = false;
  @Input() goBack: boolean = false;
  @Input() backPageUrl: string;
  @Output() public checkValidListItem = new EventEmitter();
  @Output() public goBackToPage: any = new EventEmitter();
  public showFilterList:boolean = false;
  validFilter:any;
  selectedProtocolId:any;
  filterListName:any = '';
  constructor(private storage: Storage,public router:Router,
    public SimpleService:SimpleService,
    public translationService: TranslationService) {
  }
  @Input() filterAddNew: any;
  async ngOnInit() {
    const currentProtocol = await this.storage.get('current_protocol');
    this.selectedProtocolId = currentProtocol.id;
    this.filterListName = await this.storage.get('filter_list_name');
   await this.storage.set('searchedKeyword', '');
    setTimeout(() => { this.search1.disabled = false; this.search1.setFocus(); }, 500);
    this.sortList();
    this.filteredList = this.list;
  }
  ngOnDestroy() {
      this.search1.disabled = true;
  }

  convertTickLabel(queryKey, result) {
    if (queryKey == '' || queryKey == undefined) {
      return result;
    }
    let re = new RegExp(queryKey, "gi");
    let isContained = result.toLowerCase().indexOf(result.trim().toLowerCase()) > -1;
    if (isContained) {
      result = result.replace(re, function (str) { return '<b>' + str + '</b>' });
      return result;
    }
  }
    async unCheck() {
      if (((this.selectedProtocolId == 1 || this.selectedProtocolId == 2 || this.selectedProtocolId == 3)
          && (this.filterListName == 'unit_id'))  || this.filterListName == 'tu_gu_id' || this.filterListName == 'service_provider' || this.filterListName == 'full_name') {
          this.filterListValue = '';
          await this.storage.set('filter_list_value', this.filterListValue);
          if (this.goBack) {
              setTimeout(() => {
                  this.goBackToPage.emit();
              }, 200);
          }
      }
    }
  async getSelectedList(item?, isChecked?, alreadySelected?) {
    if (!this.multiSelect) {
     await this.storage.set('filter_list_value', this.filterListValue);
      if (this.goBack && alreadySelected) {
        setTimeout(() => {
            this.goBackToPage.emit();
        }, 200);
      }
    } else {
      item.isChecked = isChecked;
      let filterIndex = this.filteredList.findIndex(listItem => listItem[this.filterId] == item[this.filterId]);
      this.filteredList[filterIndex] = item;
      await this.storage.set('filter_list_values', this.filteredList);
      if (this.goBack) {
        this.goBackToPage.emit();
      } else {
      this.checkValidListItem.emit({list: this.filteredList, selectedItem: item});
      setTimeout(async () => {
        this.validFilter = await this.storage.get('relationTypeAllow');
        this.list = await this.storage.get('filter_list_values');
        if (this.validFilter === "private_type") {
          const config = {
            message: this.translationService.translationsList.offline_tool.messages.can_not_select_business_unit,
            customClass: 'variation3'
          };
          this.SimpleService.presentAlertWithSingle(config);
          return;
        } else if (this.validFilter === "business_type") {
          const config = {
            message: this.translationService.translationsList.offline_tool.messages.can_not_select_private_unit,
            customClass: 'variation3'
          };
          this.SimpleService.presentAlertWithSingle(config);
            return;
        } else if (this.validFilter === "not_applicable") {
          const config = {
            message: this.translationService.translationsList.offline_tool.messages.can_not_select_private_or_business_unit,
            customClass: 'variation2'
          };
          this.SimpleService.presentAlertWithSingle(config);
            return;
        }
        if (this.list.length == 1) {
            this.goBackToPage.emit();
        }
      }, 200);
    }
    }
  }
  sortList() {
    let nonSelectedList;
    let selectedList;
    if (this.list.length > 0) {
      if (!this.multiSelect) {
        nonSelectedList = this.list.filter(listItem=>{
          return (listItem[this.filterId] != this.filterListValue);
        });
        selectedList = this.list.filter(listItem=>{
          return listItem[this.filterId] == this.filterListValue;
        });
        nonSelectedList.sort((a, b) => a[this.filterName] > b[this.filterName] ? 1 : -1);
      } else {
        nonSelectedList = this.list.filter(listItem=>{
          return listItem.isChecked == false;
        });
        selectedList = this.list.filter(listItem=>{
          return listItem.isChecked == true;
        });
      }
      selectedList = selectedList.concat(nonSelectedList);
      this.list = selectedList;
    }
    this.showFilterList = true;
  }
  async onSearchTerm(ev: CustomEvent, category) {
    const val = ev.detail.value;
    this.list = this.filteredList;
    if (val.trim() !== '') {
      this.list = this.list.filter(term => {
        return term[this.filterName].toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
      await this.storage.set('searchedKeyword', val.trim());
    } else {
      await  this.storage.set('searchedKeyword', '');
    }
    this.sortList();
  }
  async goToAddNewComponent() {
    let roomInfo;
    let navigationExtras: NavigationExtras;
    if (this.backPageUrl == "/add-room") {
      roomInfo = {'id':999,'room_name':'New Component'};
      navigationExtras = {
        queryParams: {
          roomInfo: JSON.stringify(roomInfo)
        }
      };
    } else {
      roomInfo = await this.storage.get('roomIdObj');
       navigationExtras = {
        queryParams: {
          roomInfo: JSON.stringify(roomInfo)
        }
      };
    }
   await this.storage.set('backPageUrl', this.backPageUrl);
    this.router.navigate(['/add-new-component'], navigationExtras);
  }
}
