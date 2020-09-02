import { Component, OnInit } from '@angular/core';
import { LangService } from '../core/services/lang.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage {

  // uid: string;

  constructor(
    private lang: LangService,
    private auth: AuthService,
    private router: Router
  ) {
    // this.uid = this.auth.getCurrUserUid();
    // console.log('-uid- ', this.uid);

  }

  selectLang(lang: string) {

    this.lang.setLang(lang);

    this.lang.setLangtoUser(lang)
     

    this.router.navigate(["app/tabs/lists"]);
  }


}
