import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SimpleService } from '../api/simple-service.service';
import { AuthService } from '../api/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../api/translation.service';
import { ModalController } from '@ionic/angular';
import { PdfPreviewPage } from '../pdf-preview/pdf-preview.page';
import { ObservableService } from '../api/observable.service';
import { PopoverController } from '@ionic/angular';

declare var require: any;
var mergeJSON = require('merge-json') ;
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    sortByDesc: boolean;
    classVariable: any;
    indexOf: any;
    isSynced: boolean = false;
    cardBox: any = [];
    syncDataContainer: any = [];
    components: any = [];
    component_room_type: any = [];
    rooms: any = [];
    accessToken: string;
    pdfObj = null;
    sortByType: string;
    sortByTrans: string;
    toggleSortByClass: boolean = false;
    toggleCollapseMenu: boolean = false;
    @ViewChild('container', {static: false}) container: ElementRef;
    @ViewChild('dropdown', {static: false}) dropdown: ElementRef;

    constructor(
        private router: Router,
        private storage: Storage,
        public service: SimpleService,
        public apiService: AuthService,
        public modalController: ModalController,
        public translate: TranslateService,
        public translations: TranslationService,
        public observableService: ObservableService,
        private popoverController: PopoverController) {
        this.service.synced$.subscribe(() => {
            this.resetPage();
        });
        document.addEventListener('click', this.offClickHandler.bind(this));
    }

    offClickHandler(event: any) {
        if (!!this.container) {
            if (!this.container.nativeElement.contains(event.target) || event.target.className === "sortText") { // check click origin
                //console.log('inside click');
            } else {
                this.toggleSortByClass = false;
            }
        }
    }
    
    async ionViewWillEnter() {
        this.cardBox = [];
        if (! await this.storage.get('loaderToShow')) {
            await this.service.showLoader();
        }
        let hideLoader = true;
        // this.service.showLoader('Bitte warten...');
        const loginDetails = await this.storage.get('login_detail');
        this.accessToken = loginDetails.access_token;
        if (this.accessToken === undefined) {
            await this.service.hideLoader();
            this.router.navigate(['/login']);
        } else {
            const expireDate = new Date(loginDetails.expires_at);
            if (expireDate <= new Date()) {
                await this.storage.set('login_detail', '');
                await this.service.hideLoader();
                this.router.navigate(['/login']);
            } else {
                hideLoader = false;
                await this.service.syncData(this.accessToken, false);
            }
        }
        await this.storage.set('filter_list_value', null);
        await this.storage.set('filter_list_values', []);
        await this.storage.set('filter_list_name', null);
        await this.storage.set('parties_info', null);
        await this.storage.set('cityInfo', null);
        await this.translations.getTranslations();
        // const translations = await this.storage.get('translations');
        // var newlist = mergeJSON.merge(translations.protocol_types, translations.offline_tool.navigations);
        // this.translate.setTranslation('el', newlist);
        var submitData = await this.storage.get('submit_data');
        if (submitData != null) {
            this.cardBox = submitData.filter(submitDataItem => {
                return submitDataItem.card.user_id === loginDetails.user_id;
            });
            this.sortByDesc = true;
            this.sortByType = 'creation_date';
            this.sortByTrans = 'offline_tool.labels.sort_by_options.creation_date';
            this.sortCardBox();
        } else {
            this.cardBox = [];
        }
        if (hideLoader) {
            await this.service.hideLoader();
        }
    }
    sortCard($event) {
        this.sortByType = $event.Type;
        this.sortCardBox();
        this.openSort();
    }
    async resetPage() {
        const submitData = await this.storage.get('submit_data');
        if (submitData === null) {
            this.cardBox = [];
        }
    }
    async goToProtocol() {
        await this.storage.set('current_index', -1).then((val) => {
            this.router.navigate(['/new-protocol']);
        });
    }
    toggleSortBy() {
        this.sortByDesc = !this.sortByDesc;
        this.sortCardBox();
    }
    async sortCardBox() {
        if (this.sortByType == "creation_date") {
            this.sortByTrans = 'offline_tool.labels.sort_by_options.creation_date';
            if (this.sortByDesc) {
                this.cardBox.sort((val1, val2) => {return val2.card.created_at - val1.card.created_at});
            } else {
                this.cardBox.sort((val1, val2) => {return val1.card.created_at - val2.card.created_at});
            }
        } else if (this.sortByType == "project") {
            this.sortByTrans = 'offline_tool.placeholders.quarter';
            if (this.sortByDesc) {
                this.cardBox.sort((val1, val2) => {return val2.card.internal_quarter_id - val1.card.internal_quarter_id});
            } else {
                this.cardBox.sort((val1, val2) => {return val1.card.internal_quarter_id - val2.card.internal_quarter_id});
            }
        } else {
            this.sortByTrans = 'offline_tool.labels.sort_by_options.protocol_type';
            if (this.sortByDesc) {
                this.cardBox.sort((val1, val2) => {return val2.protocol_type.id - val1.protocol_type.id});
            } else {
                this.cardBox.sort((val1, val2) => {return val1.protocol_type.id - val2.protocol_type.id});
            }
        }
        await this.storage.set('submit_data', this.cardBox);
    }
    syncData(indexOf) {
        this.service.showLoader(this.translations.translationsList.offline_tool.messages.syncing);
        let syncData = this.cardBox[indexOf];
        this.apiService.syncData(this.accessToken, syncData).subscribe(async result => {
            this.cardBox[indexOf].card.isSynced = true;
            this.cardBox[indexOf].card.active = false;
            await this.storage.set('submit_data', this.cardBox);
            this.service.hideLoader();
            this.service.presentAlertWithSingle(this.translations.translationsList.offline_tool.messages.protocol_synced_successfully);
            this.isSynced = false;
        }, error => {
            this.service.hideLoader();
            this.service.presentAlertWithSingle(this.translations.translationsList.offline_tool.messages.fail);

        });
    }

    toggleClass(item: any, index) {
        for ( let i = 0; i < this.cardBox.length; ++i) {
            if ( i === index) {
                item.card.active = !item.card.active;
            } else {
                this.cardBox[i].card.active = false;
            }
        }
    }

    openSort() {
        this.toggleSortByClass = !this.toggleSortByClass;
    }
    CollapseMenu(){
        this.toggleCollapseMenu = !this.toggleCollapseMenu;
        this.toggleSortByClass = false;
    }
    deleteCard(indexOf: any) {
        this.indexOf = indexOf;
        let alertMessage = this.translations.translationsList.offline_tool.messages.are_you_sure_to_delete_non_synced_submission;
        if (this.cardBox[this.indexOf].card.isSynced) {
             alertMessage = this.translations.translationsList.offline_tool.messages.are_you_sure_to_delete_synced_submission;
        }
        const config = {
            message: alertMessage,
            showYesButton: true,
            showNoButton: true,
            customClass: 'variation2'
        };
        this.service.presentConfirmPopup(config, async () => {
            this.cardBox.splice(this.indexOf, 1);
            await this.storage.set('submit_data', this.cardBox);
        });
    }

    async goToParties(indexOf: any) {
        let links = await this.storage.get('links');
        links = this.observableService.modifyLinks(links, 2, this.cardBox[indexOf].rooms);
        this.observableService.setLinks(links);
        await this.storage.set('current_mode', 'Edit');
        await this.storage.set('current_protocol', this.cardBox[indexOf].protocol_type);
        await this.storage.set('current_index', indexOf).then((val) => {
            this.router.navigate(['/parties']);
        });
    }

    async openModal(itemCard) {
        const modal = await this.modalController.create({
            component: PdfPreviewPage,
            componentProps: { pdf: itemCard.conclusion.PDF}
        });
        modal.onDidDismiss().then((detail) => { });
        await modal.present();
    }

   async onCardTap(i, itemCard) {
        if (!itemCard.card.completed && !itemCard.card.isSynced) {
            this.goToParties(i);
        } else if (itemCard.card.completed || itemCard.card.isSynced) {
            this.openModal(itemCard);
        }
    }
}
