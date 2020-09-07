import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { LangService, Language } from './lang.service';
import { AudioRecordsProviderService } from './audio-records-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WordsProviderService {

  uid: string;
  currLang: Language;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private audioService: AudioRecordsProviderService,
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

    this.audioService.removeWordAudioRecord(list_id, word_id);
  }
}
