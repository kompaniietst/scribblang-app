import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import * as firebase from "firebase";
import { LangService, Language } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksProviderService {

  private bookmSubj: BehaviorSubject<Word[]> = new BehaviorSubject<Word[]>([])
  bookmSubjArr = [];
  bookmarks$ = this.bookmSubj.asObservable();

  uid: string;
  currLang: Language;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private lang: LangService,
  ) {

    this.auth.user$
      .subscribe(user => this.uid = user?.uid)

    this.lang.lang$
      .subscribe(lang => this.currLang = lang)
  }

  bookmarkWord(id: string) {
    this.firestore
      .collection("words_____")
      .doc(id)
      .set({ is_bookmarked: true }, { merge: true });

    this.getAllBookmarks();
  }

  getAllBookmarks() {
    return firebase.firestore().collection("words_____")
      .where("uid", "==", this.uid)
      .where("is_bookmarked", "==", true)
      .where("lang", "==", this.currLang.locale)
      .get()
      .then(x => {
        var words = x.docs.map(item => {
          return {
            id: item.id,
            original: item.data()["original"],
            translation: item.data()["translation"],
            transcription: item.data()["transcription"],
            createdAt: item.data()["createdAt"],
            list_id: item.data()["list_id"],
            is_bookmarked: item.data()["is_bookmarked"],
            lang: item.data()["lang"],
            uid: item.data()["uid"],
          }
        })

        this.bookmSubjArr = words;
        this.bookmSubj.next([...this.bookmSubjArr]);
      })
  }

  unBookmark(id: string) {
    this.firestore
      .collection("words_____")
      .doc(id)
      .set({ is_bookmarked: false }, { merge: true })
      .then(() => this.getAllBookmarks())
  }
}
