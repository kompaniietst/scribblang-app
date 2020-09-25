import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import * as firebase from "firebase";
import { LangService, Language } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class WordsProvideService {

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

  getWordsBy(list_id: string): Observable<any> {
    return this.firestore
      .collection("words_____", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "==", list_id)
        .where("uid", "==", this.uid)
      )
      .snapshotChanges()
  }

  getWordsByLists(list_id: string[]): Promise<any> {
    console.log('LIST', list_id);

    // var l1 = this.firestore
    //   .collection("words_____", ref => ref
    //     .orderBy("createdAt", "desc")
    //     .where("list_id", "==", list_id[0])
    //     .where("uid", "==", this.uid)
    //   )

    // var l2 = this.firestore
    //   .collection("words_____", ref => ref
    //     .orderBy("createdAt", "desc")
    //     .where("list_id", "==", list_id[1])
    //     .where("uid", "==", this.uid)
    //   )


    //   firebase.firestore().getAll(l1, l2).then(docs => {
    //   console.log(`First document: ${JSON.stringify(docs[0])}`);
    //   console.log(`Second document: ${JSON.stringify(docs[1])}`);
    // });




    return this.firestore
      .collection("words_____", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "in", list_id)
        .where("uid", "==", this.uid)
      )
      .get().toPromise()
  }

  createWord(list_id: string, word: Partial<Word>) {
    var newWord = Object.assign(
      { list_id: list_id, uid: this.uid, lang: this.currLang.locale }, word);

    return this.firestore
      .collection("words_____")
      .add(newWord)
  }

  editWord(word: Word): Promise<any> {
    return this.firestore
      .collection("words_____")
      .doc(word.id)
      .set(word)
  }

  removeWord(list_id: string, word_id: string) {
    this.firestore
      .collection("words_____")
      .doc(word_id)
      .delete()

    var audioRec = firebase.storage().ref().child(list_id + "/" + word_id + ".mp3");

    audioRec.delete().then(function () {
      console.log('removed rec');
    }).catch(function (error) {
      console.log('catch removing rec');
    });
  }
}