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

  currLang: Language;
  langs$: Observable<Language[]>;

  constructor(
    public auth: AuthService,
    private storage: Storage,
    private lang: LangService
  ) {
    this.lang.lang$.subscribe(x => {
      console.log('lang$=>', x);

      this.currLang = x
    })

    this.langs$ = this.lang.getLanguageList();
  }
  remLang() {
    this.storage.remove("lang").then((x) => console.log('remove', x));
  }
  logout = () => this.auth.logout();

  selectLang = (lang: Language) => {
    console.log('set ', lang);

    this.storage.set("lang", JSON.stringify(lang));
    this.lang.setLang(lang);
  };
}
