import {Component, OnInit} from '@angular/core';
import {SimpleService} from '../api/simple-service.service';
import {AuthService} from '../api/auth.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginAuth: any;
    userInfo: any = {email: '', password: ''};
    isRemeberMe: any = false;

    constructor(private router: Router, public service: SimpleService, public apiService: AuthService, public storage: Storage) {
    }

    ngOnInit() {
        this.storage.get('login_detail').then((val) => {
            if (!!val) {
                this.router.navigate(['/home']);
            }
        });

        this.storage.get('login_cred').then((val) => {
            if (val) {
                this.userInfo.email = val.email;
                this.userInfo.password = val.password;
            }
        });
    }

    changeValue() {
        this.isRemeberMe = !this.isRemeberMe;
    }

    async gotoHome() {
        await this.service.showLoader('Bitte warten...');
        setTimeout(() => {
            this.userSignIn();
        }, 200);

    }

    async userSignIn() {
        if (this.userInfo.email == '') {
            await this.service.hideLoader();
            await this.service.presentAlertWithSingle('Die E-Mail ist Pflicht!');
        } else if (this.userInfo.password == '') {
            await this.service.hideLoader();
            await this.service.presentAlertWithSingle('Das Password ist Pflicht!');
        } else {
            if (this.isRemeberMe) {
                await this.storage.set('login_cred', this.userInfo);
            }
            this.userInfo.remember_me = true;
            this.apiService.userLogin(this.userInfo).subscribe(async (result) => {
                this.loginAuth = result;
                const checkFirstLogin = await this.storage.get('isFirstLogin');
                if (checkFirstLogin === null) {
                    await this.storage.set('isFirstLogin', true);
                    await this.storage.remove('submit_data');
                }
                await this.storage.set('login_detail', result);
               // await this.service.hideLoader();
                this.router.navigate(['/home']);
            }, async error => {
                await this.service.hideLoader();
                const config = {
                    message: error.error.message,
                    customClass: 'variation2'
                };
                this.service.presentAlertWithSingle(config);
            });
        }

    }

}
