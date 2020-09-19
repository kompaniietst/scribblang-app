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
    // {
    //   locale: "de_DE",
    //   label: "Germany",
    //   ttsActive: false
    // },
    // {
    //   locale: "de_LU",
    //   label: "Luxembourg",
    //   ttsActive: false
    // },
    {
      locale: "other",
      label: "Other",
      ttsActive: false
    },
  ]);

  private langSubj: BehaviorSubject<Language> = new BehaviorSubject(null);
  public lang$ = this.langSubj.asObservable();
  uid: string;

  constructor(
    private storage: Storage
  ) {

    this.storage.get("lang")
      .then((l: string) => this.langSubj.next(JSON.parse(l)));

    this.languages$
      .subscribe((l: Language[]) => this.languages = l)
  }

  getCurrLang(): Language {
    return this.langSubj.value;
  }

  getLanguageList(): Observable<Language[]> {
    return this.languages$;
  }

  checkIfTTSActive() {
    console.log(this.languages);
    this.languages
      .filter(l => l.ttsActive)
      .some(l => l.label === this.langSubj.value.label);
  }

  setLang = (lang: Language) => this.langSubj.next(lang);
}
