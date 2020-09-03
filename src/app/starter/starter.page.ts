import { Component, OnInit } from '@angular/core';
import { LangService } from '../core/services/lang.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage implements OnInit {

  // uid: string;

  constructor(
    private lang: LangService,
    private router: Router
  ) {
    this.lang.lang$
      .pipe(take(3),
        map(x => { return x }))
      .subscribe(langIsSet => {
        if (!!langIsSet) this.router.navigate(["app/tabs/lists"]);
      })
  }

  ngOnInit(): void {

    //  console.log('init', this.lang.getLang());
    // this.lang.lang$
    //   .subscribe(x=>
    //   console.log('AUTHHH', this.lang.getLang())
    //   )
  }

  selectLang(lang: string) {

    this.lang.setLang(lang);

    this.lang.setLangtoUser(lang)


    this.router.navigate(["app/tabs/lists"]);
  }


}
