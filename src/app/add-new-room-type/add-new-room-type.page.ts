import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SimpleService } from '../api/simple-service.service';
import { TranslationService } from '../api/translation.service';

@Component({
  selector: 'app-add-new-room-type',
  templateUrl: './add-new-room-type.page.html',
  styleUrls: ['./add-new-room-type.page.scss'],
})
export class AddRoomNewRoomTypePage implements OnInit {
  getNewRoomTypeName: any;
  getNewRoomTypeNameOld: any;
  filterListType: any;
  constructor(
    private storage: Storage,
    private router: Router,
    public service: SimpleService,
    public TranslationService: TranslationService
  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    this.getNewRoomTypeName =  await this.storage.get('searchedKeyword');
    this.getNewRoomTypeNameOld =  await this.storage.get('searchedKeyword');
    this.filterListType = await this.storage.get('new_room_data');
  }
  async closeListSelector() {
    if (this.getNewRoomTypeName == '') {
      this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
    } else {
        this.filterListType['new_room_type'] = this.getNewRoomTypeName;
       await this.storage.set('new_room_data', this.filterListType);
        this.router.navigate(['/add-room']);
    }
  }
  goBackToAddRoom() {
      if (this.getNewRoomTypeName != this.getNewRoomTypeNameOld) {
          this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
              this.router.navigate(['/add-room-type']);
          });
      } else {
          this.router.navigate(['/add-room-type']);
      }
  }
}


