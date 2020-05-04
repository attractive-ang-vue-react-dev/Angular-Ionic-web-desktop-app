import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';

@Component({
  selector: 'app-add-room-type',
  templateUrl: './add-room-type.page.html',
  styleUrls: ['./add-room-type.page.scss'],
})
export class AddRoomRoomTypePage implements OnInit {

  filterListType:any;
  filterListValue:any;
  listHeader: any;
  filterId: any;
  filterName: any;
  listArr:any = [];
  filteredListArr:any = [];
  isNewRoomType:any;
  constructor(private storage: Storage,
    private router: Router,
    private TranslationService: TranslationService) { }

    ngOnInit() {
    }
    async ionViewWillEnter() {
      this.filterListType = await this.storage.get('new_room_name');
      this.filterListValue = await this.storage.get('filter_list_value');
      this.isNewRoomType = await this.storage.get('new_room_data');

      if (this.filterListType == 'new_room_type') {
        this.listHeader =  this.TranslationService.translationsList.offline_tool.labels.room_type;
        this.listArr = await this.storage.get('room_types');
        for (let index = 0; index < this.listArr.length-1; index++) {
          var transaltedRoomType = this.TranslationService.translationsList.room_types[this.listArr[index].name];
          this.listArr[index].name = !!transaltedRoomType?transaltedRoomType:this.listArr[index].name;
        }


        this.listArr.sort((a, b) => (a.name > b.name) ? 1 : -1);
        this.filteredListArr = this.listArr;
        this.filterId = 'id';
        this.filterName = 'name';
        if (!!this.filterListValue) {
          this.listArr = this.filteredListArr.filter(item => item.id == this.filterListValue);
          let tempList = this.filteredListArr.filter(item => item.id !== this.filterListValue);
          this.listArr = this.listArr.concat(tempList);
        }
        this.isNewRoomType['isNewRoomType'] = false;
       await this.storage.set('new_room_data',this.isNewRoomType);
      }
    }
    async closeListSelector() {
      this.filterListValue = await this.storage.get('filter_list_value');
     await this.storage.set('new_room_type_id',this.filterListValue);
      this.router.navigate(['/add-room']);
    }

    async goToAddNewRoomType() {
      this.isNewRoomType['isNewRoomType'] = true;
     await this.storage.set('new_room_data',this.isNewRoomType);
      this.router.navigate(['/add-new-room-type']);
    }
  }

