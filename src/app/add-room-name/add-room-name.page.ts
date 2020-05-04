import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslationService } from '../api/translation.service';
import { SimpleService } from '../api/simple-service.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-add-room-name',
  templateUrl: './add-room-name.page.html',
  styleUrls: ['./add-room-name.page.scss'],
})
export class AddRoomRoomNamePage implements OnInit {
  @ViewChild(IonInput, { static: false }) inputField: IonInput;
  getNewRoomName:any;
  filterListType:any;
  getNewRoomNameOld:any;
  constructor(public service:SimpleService, private storage: Storage,
    private router: Router,
    private TranslationService: TranslationService) { }

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
    }, 200);
    this.filterListType = await this.storage.get('new_room_data');
    this.getNewRoomName = this.filterListType.new_room_name;
    this.getNewRoomNameOld = this.filterListType.new_room_name;
  }
  async closeListSelector() {
    if(this.getNewRoomName == '' || this.getNewRoomName == undefined){
      this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.Please_fill_required_field);
      return;
    }
    this.filterListType['new_room_name'] = this.getNewRoomName;
   await this.storage.set('new_room_data', this.filterListType);
    this.router.navigate(['/add-room']);
  }

  goToAddNewRoom(){
    if (this.getNewRoomName != this.getNewRoomNameOld) {
        this.service.presentConfirmPopupChangesLost(this.TranslationService.translationsList.offline_tool.messages.changes_will_be_lost, () => {
            this.router.navigate(['/add-room']);
        });
    } else {
        this.router.navigate(['/add-room']);
    }
  }
}



