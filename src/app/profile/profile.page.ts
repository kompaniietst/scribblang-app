import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { LangService } from '../core/services/lang.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  currLang: string = "ww";

  constructor(
    private auth: AuthService,
    private lang: LangService
  ) {

    this.lang.lang$
      .subscribe((lang: string) => this.currLang = lang);
  }

  logout = () => this.auth.logout();


  selectLang(lang: string) {
    console.log('lang=> ', lang);

    this.lang.setLang(lang);
    // this.router.navigate(["app/tabs/lists"], { queryParams: { lang: lang || 'en' } });
  }

}
