import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {SimpleService} from '../api/simple-service.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from '../api/translation.service';
import { ObservableService } from '../api/observable.service';
declare var require: any;
var mergeJSON = require('merge-json');

@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous.page.html',
    styleUrls: ['./miscellaneous.page.scss'],
})
export class MiscellaneousPage implements OnInit {
    keyDirectoryArray: any = [];
    miscellaneousGeneralList: any = [];
    miscellaneousGeneralNote: any;
    selectedProtocol: any;
    selectedProtocolId: any;
    currentProtocolName: any;
    currentProtocolId: any;
    informationBrochure: any = false;
    handedOverCleaned: any = false;
    pageLoad:boolean = false;

    constructor(private router: Router, private storage: Storage, public service: SimpleService, public translate: TranslateService, public TranslationService: TranslationService,
        public observableService: ObservableService) {
    }

    ngOnInit() {
        this.storage.get('current_protocol').then((val) => {
            if (val) {
                this.selectedProtocol = val;
                this.selectedProtocolId = val.id;
                this.currentProtocolId = val.id;
                this.currentProtocolName = val.name;
            }
        });
    }

    async goToConclusion() {
        const current_index = await this.storage.get('current_index');
        let submit_data = await this.storage.get('submit_data');
        if (this.currentProtocolId !== 1) {
            submit_data[current_index].miscellaneous.key = this.keyDirectoryArray;
            submit_data[current_index].miscellaneous.general = this.miscellaneousGeneralList;
            submit_data[current_index].miscellaneous.information_brochure = this.informationBrochure;
            submit_data[current_index].miscellaneous.handed_over_cleaned = this.handedOverCleaned;
        }
        submit_data[current_index].miscellaneous.general_note = this.miscellaneousGeneralNote;
        await this.storage.set('submit_data', submit_data);
        this.router.navigate(['/conclusion']);
    }

    async ionViewWillEnter() {
        await this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
        const current_index = await this.storage.get('current_index');
        let submit_data = await this.storage.get('submit_data');
        this.observableService.isRoomsChanged = false;
        let links = await this.storage.get('links');
        links = this.observableService.modifyLinks(links, 4, submit_data[current_index].rooms);
        this.observableService.setLinks(links);
        const currentProtocol = await this.storage.get('current_protocol');
        this.currentProtocolId = currentProtocol.id;
        this.currentProtocolName = currentProtocol.name;
        await this.TranslationService.getTranslations();
        this.pageLoad = false;

        // const translations = await this.storage.get('translations');
        // var newlist = mergeJSON.merge(translations.misc_key_lists, translations.misc_generals);
        // this.translate.setTranslation('el', newlist);


        if (this.currentProtocolId == 4 || this.currentProtocolId == 5) {
            this.keyDirectoryArray = submit_data[current_index].miscellaneous.key;
            this.miscellaneousGeneralList = submit_data[current_index].miscellaneous.general;
            this.miscellaneousGeneralNote = submit_data[current_index].miscellaneous.general_note;

            if (!this.miscellaneousGeneralList.find(item => item.name === 'handed_over_cleaned')) {
                this.miscellaneousGeneralList.push({id: 6, name: 'handed_over_cleaned'});
            }
            this.informationBrochure = !!submit_data[current_index].miscellaneous.information_brochure ? submit_data[current_index].miscellaneous.information_brochure : false;
            this.handedOverCleaned = !!submit_data[current_index].miscellaneous.handed_over_cleaned ? submit_data[current_index].miscellaneous.handed_over_cleaned : false;
            for (let index = 0; index < this.miscellaneousGeneralList.length; index++) {
                if (this.miscellaneousGeneralList[index].name == 'information_brochure') {
                    let interChangeInfoBrochure = this.miscellaneousGeneralList[this.miscellaneousGeneralList.length - 2];
                    this.miscellaneousGeneralList[this.miscellaneousGeneralList.length - 2] = this.miscellaneousGeneralList[index];
                    this.miscellaneousGeneralList[index] = interChangeInfoBrochure;
                }
                if (this.miscellaneousGeneralList[index].name == 'handed_over_cleaned') {
                    this.miscellaneousGeneralList.push(this.miscellaneousGeneralList.splice(index, 1)[0]);
                }
                if (!this.miscellaneousGeneralList[index].key_value)
                    this.miscellaneousGeneralList[index]['key_value'] = 0;
            }

            for (let indexi = 0; indexi < this.keyDirectoryArray.length; indexi++) {
                if (!this.keyDirectoryArray[indexi].key_value)
                    this.keyDirectoryArray[indexi]['key_value'] = 0;
            }
           
        } else {
            this.miscellaneousGeneralNote = submit_data[current_index].miscellaneous.general_note;
            submit_data[current_index].miscellaneous = {
                general_note : this.miscellaneousGeneralNote
            };
            await this.storage.set('submit_data', submit_data);
        }
        this.pageLoad = true;
        await this.service.hideLoader();
    }

   async disableConclusionMenuLink() {
        let links = await this.storage.get('links');
        links = this.observableService.disableLinks(links, 4);
        this.observableService.setLinks(links);
    }
    incrementValue(index, type) {
        if (type == 'Key') {
            this.keyDirectoryArray[index].key_value++;
        } else {
            this.miscellaneousGeneralList[index].key_value++;
        }
        this.disableConclusionMenuLink();
    }

    decrementValue(index, type) {
        if (type == 'Key') {
            if (this.keyDirectoryArray[index].key_value) {
                if (this.keyDirectoryArray[index].key_value == 0) {
                    return;
                } else {
                    this.keyDirectoryArray[index].key_value--;
                }
            }
        } else {
            if (this.miscellaneousGeneralList[index].key_value) {
                if (this.miscellaneousGeneralList[index].key_value == 0) {
                    return;
                } else {
                    this.miscellaneousGeneralList[index].key_value--;
                }
            }
        }
        this.disableConclusionMenuLink();
    }
}