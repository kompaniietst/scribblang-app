import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  private langSubj: BehaviorSubject<string> = new BehaviorSubject("");
  public lang$ = this.langSubj.asObservable();

  uid: string;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore
  ) {


    this.auth.user$
      .subscribe(
        x => {
          this.uid = x.uid; this.getLang();
        }
      )

  }

  test() {
    console.log('test');
  }

  get() {
    return this.langSubj.value;
  }

  setLangtoUser(lang: string) {

    this.firestore.collection("users")
      .doc(this.uid)
      .set({ lang: lang }, { merge: true })
      .then(x => this.langSubj.next(lang));
  }

  getLang() {
    console.log('GGGETT', this.uid);

    this.firestore.collection("users")
      .doc(this.uid)
      .get()
      .subscribe(x => {
        var lang = x.data()?.lang;
        if (lang) this.langSubj.next(lang);
      })
  }



  setLang = (lang: string) => this.langSubj.next(lang);

  // getLang = () => this.langSubj.value;
}
