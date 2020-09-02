import { Component, OnInit } from '@angular/core';
import { LangService } from '../core/services/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage {

  constructor(private lang: LangService, private router: Router) { }

  selectLang(lang: string) {

    this.lang.setLang(lang);
    this.router.navigate(["app/tabs/lists"], { queryParams: { lang: lang || 'en' } });
  }


}
