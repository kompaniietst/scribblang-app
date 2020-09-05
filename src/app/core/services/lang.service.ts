import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
import { Storage } from "@ionic/storage";

export class Language {
  locale: string;
  label: string;
  ttsActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LangService {

  // currLang: string;
  languages: Language[] = [];

  languages$ = of([
    {
      locale: "en-US",
      label: "English",
      ttsActive: true
    },
    {
      locale: "he_IL",
      label: "Hebrew",
      ttsActive: false
    },
    {
      locale: "de_DE",
      label: "Germany",
      ttsActive: false
    },
    {
      locale: "de_LU",
      label: "Luxembourg",
      ttsActive: false
    },
    {
      locale: "other",
      label: "Other",
      ttsActive: false
    },
  ]);


  private langSubj: BehaviorSubject<string> = new BehaviorSubject("");
  public lang$ = this.langSubj.asObservable();

  uid: string;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private storage: Storage
  ) {


    this.storage.get("lang")
      .then((l: string) => this.langSubj.next(l));

    this.languages$
      .subscribe((l: Language[]) => this.languages = l)

    // this.auth.user$
    //   .subscribe(
    //     x => {
    //       this.uid = x.uid; this.getLang();
    //     }
    //   )
  }

  // getCurrLang(): Promise<string> {
  //   return this.storage.get("lang");
  // }

  getLanguageList(): Observable<Language[]> {
    return this.languages$;
  }

  checkIfTTSActive() {
    console.log(this.languages);
    this.languages
      .filter(l => l.ttsActive)
      .some(l => l.label === this.langSubj.value);
  }

  // test() {
  //   console.log('test');
  // }

  // get() {
  //   return this.langSubj.value;
  // }

  // setLangtoUser(lang: string) {

  //   this.firestore.collection("users")
  //     .doc(this.uid)
  //     .set({ lang: lang }, { merge: true })
  //     .then(x => this.langSubj.next(lang));
  // }

  // getLang() {
  //   console.log('GGGETT', this.uid);

  //   this.firestore.collection("users")
  //     .doc(this.uid)
  //     .get()
  //     .subscribe(x => {
  //       var lang = x.data()?.lang;
  //       if (lang) this.langSubj.next(lang);
  //     })
  // }



  setLang = (lang: string) => this.langSubj.next(lang);

  // getLang = () => this.langSubj.value;
}
