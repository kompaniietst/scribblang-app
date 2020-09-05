import { Component, OnInit } from '@angular/core';
import { LangService, Language } from '../core/services/lang.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { map, take } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage implements OnInit {

  currLang: string;
  langs$: Observable<Language[]>;

  constructor(
    private lang: LangService,
    private router: Router,
    private storage: Storage
  ) {
    this.storage.get("lang").then(x => this.currLang = x)
    this.langs$ = this.lang.getLanguageList();
  }

  ngOnInit(): void { }

  selectLang(lang: string) {
    this.storage.set('lang', lang);
    this.lang.setLang(lang);
    this.router.navigate(["app/tabs/lists"]);
  }
}
