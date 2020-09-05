import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { LangService, Language } from '../core/services/lang.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  currLang: string;
  langs$: Observable<Language[]>;

  constructor(
    private auth: AuthService,
    private storage: Storage,
    private lang: LangService
  ) {
    this.lang.lang$.subscribe(x => this.currLang = x)
    this.langs$ = this.lang.getLanguageList();
  }

  logout = () => this.auth.logout();

  selectLang = (lang: string) => {
    this.storage.set("lang", lang);
    this.lang.setLang(lang);
  };
}
