import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {SimpleService} from 'src/app/api/simple-service.service';

@Component({
    selector: 'bottom-menu',
    templateUrl: './bottom-menu.component.html',
    styleUrls: ['./bottom-menu.component.scss'],
})
export class BottomMenuComponent implements OnInit {
    accessToken: string;

    constructor(private storage: Storage,
                public router: Router,
                public service: SimpleService) {
    }

    async ngOnInit() {

    }

    async logout() {
        await this.storage.set('login_detail', '');
        this.router.navigate(['/login']);
    }

    async syncData(clearStorage?) {
        this.storage.get('login_detail').then(async (val) => {
          this.accessToken = val.access_token;
          if (this.accessToken == undefined) {
              this.router.navigate(['/login']);
          } else {
              const expireDate = new Date(val.expires_at);
              if (expireDate <= new Date()) {
                 await this.storage.set('login_detail', '');
                  this.router.navigate(['/login']);
              } else {
                  if (clearStorage) {
                      this.service.syncData(this.accessToken, true, true);
                  } else {

                      this.service.syncData(this.accessToken, true);
                  }
              }
          }
        }, (err) => {
        });
    }
}
