import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ObservableService } from '../api/observable.service';
import { RouterExtService } from '../api/router-ext.service';
import { SimpleService } from '../api/simple-service.service';
import { TranslationService } from '../api/translation.service';

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.page.html',
  styleUrls: ['./add-floor.page.scss'],
})
export class AddFloorPage implements OnInit {

  filterId: any;
  filterName: any;
  listArr = [];
  filterListValue = [];
  goBack: boolean = false;
  multiSelect: boolean = true;
  show: boolean = false;

  constructor(public translate: TranslateService, private router: Router, private storage: Storage, public service: SimpleService, public alertController: AlertController, public TranslationService: TranslationService, private routerExtService: RouterExtService,
    public observableService: ObservableService, public translations: TranslationService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let deletedFloors = await this.getDeletedFloors();
    this.filterId = 'id';
    this.filterName = 'floorName';
    this.multiSelect = true;
    this.listArr = deletedFloors;
    this.filterListValue = deletedFloors;
    this.listArr.forEach(list => {
      list.isChecked = false;
    });
    await this.storage.set('filter_list_value', deletedFloors);
    this.show = true;
  }

  /**
   * method to go room page on back button without save data
   */
  async backToRoomPage() {
    this.router.navigate(['/rooms']);
  }

  /**
   * method to go room page button with save data
   */
  async goToRoomsPage() {
    await this.updateSubmitFloors();
    this.router.navigate(['/rooms']);
  }

  /**
   * method to save and go back room page on single option click
   */
  async closeListSelector() {
    await this.updateSubmitFloors();
    this.router.navigate(['/rooms']);
  }

  async validationOnFilterList(filterValues) {
    await this.storage.set('relationTypeAllow', 'allow');
  }

  /**
   * method to find deleted floors on basis of submitted floors and api floors
   */
  async getDeletedFloors() {
    await this.storage.set('filter_list_name', 'floorName');
    const currentIndex = await this.storage.get('current_index');
    const submitData = await this.storage.get('submit_data');
    const buildings = await this.storage.get('buildings');
    const apiFloors = await this.storage.get('floors');
    const submittedFloors = submitData[currentIndex].floors;
    const selectedBuildingId = submitData[currentIndex].parties.building_id;
    const allFloorsIds = buildings.filter(building => building.id === selectedBuildingId)[0].floors;

    let allFloors = [];
    allFloorsIds.map(floorId => {
      let floorIndex = apiFloors.findIndex(floorIds => floorIds.id === floorId);
      allFloors.push(apiFloors[floorIndex]);
    });

    let deletedFloors = allFloors.filter(allFloor => {
      const result = submittedFloors.find(submitFloor => submitFloor.id === allFloor.id);
      return !result;
    });
    deletedFloors.map(floor => {
      const translatedName = this.translations.translateText(this.translations.translationsList.floors, floor.name);
      floor.floorName = translatedName;
    });

    return deletedFloors;
  }

  /**
   * method to update submit floor data
   */
  async updateSubmitFloors() {
    let filteredList = await this.storage.get('filter_list_values');
    let selectedFloors = filteredList.filter(item => item.isChecked === true);
    let currentIndex = await this.storage.get('current_index');
    let submitData = await this.storage.get('submit_data');
    let submittedFloors = submitData[currentIndex].floors;
    selectedFloors.map(floor => {
      floor.showDelete = true;
    });
    submittedFloors = submittedFloors.concat(selectedFloors);
    submitData[currentIndex].floors = submittedFloors;
    return await this.storage.set('submit_data', submitData);
  }

}
