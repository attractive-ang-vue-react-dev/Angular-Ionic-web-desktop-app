import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {SimpleService} from '../api/simple-service.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from '../api/translation.service';

@Component({
    selector: 'app-new-protocol',
    templateUrl: './new-protocol.page.html',
    styleUrls: ['./new-protocol.page.scss'],
})
export class NewProtocolPage implements OnInit {
    selectedProtocol: any;
    selectedProtocolId: any;
    isProtocolSelected: any = false;
    protocolList: any = [];
    translations: any;

    constructor(
        public service: SimpleService,
        private router: Router,
        private storage: Storage,
        public translate: TranslateService,
        public TranslationService: TranslationService) {
    }

    ngOnInit() {
        this.storage.get('protocol_types').then((val) => {
            if (val) {
                this.protocolList = val;
            }
        });
    }

    async ionViewWillEnter() {
        this.TranslationService.getTranslations();
    }
    goToHomePage() {
        this.router.navigate(['/home']);
    }
    async goToParties() {
        this.selectedProtocol = this.protocolList.find(item => item.id == this.selectedProtocolId);
        if (this.selectedProtocolId == '' || this.selectedProtocolId == null) {
            this.service.presentAlertWithSingle(this.TranslationService.translationsList.offline_tool.messages.please_select_atleast_one_protocol);
        } else {
            this.service.showLoader(this.TranslationService.translationsList.offline_tool.messages.please_wait);
           // setTimeout(() => {
                await this.storage.set('current_protocol', this.selectedProtocol);
                // this.storage.set('current_mode', 'Create');
                // this.storage.remove('current_index');
               // this.service.hideLoader();
                this.router.navigate(['/parties']);
           // }, 500);
        }
    }
}
