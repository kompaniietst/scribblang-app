import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from "firebase";
import { AngularFireAuth } from '@angular/fire/auth';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { LangService, Language } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  uid: string;
  currLang: Language;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private streamingMedia: StreamingMedia,
    private lang: LangService,
    private afAuth: AngularFireAuth
  ) {

    this.auth.user$
      .subscribe(user => this.uid = user?.uid)

    this.lang.lang$
      .subscribe(lang => {
        this.currLang = lang;
        this.getFileSystemEntities();
      })

  }

  play(list_id: string, id: string) {
    var ref = firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + '/' + id + '.mp3');
    ref.getDownloadURL()
      .then(url => this.streamingMedia.playAudio(url))
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

    var audioRec = firebase.storage().ref().child(list_id + "/" + word_id + ".mp3");

    audioRec.delete().then(function () {
      console.log('removed rec');
    }).catch(function (error) {
      console.log('catch removing rec');
    });
  }

  getFileSystemEntities() {
    return firebase.firestore().collection("systemEntities_____")
      .orderBy("createdAt", "desc")
      .where("uid", "==", this.uid)
      .where("lang", "==", this.currLang.locale)
  }

  createFileSystemEntity(obj: Partial<FileSystemEntity>) {
    obj["createdAt"] = new Date();
    obj["uid"] = this.uid;
    obj["lang"] = this.currLang.locale;

    return this.firestore
      .collection("systemEntities_____")
      .add(obj)
      .then(() => {
        this.getFileSystemEntities();
      });
  }

  editFileSystemEntity(doc_id: string, systemEntityName: string) {
    return this.firestore
      .collection("systemEntities_____")
      .doc(doc_id)
      .update({ name: systemEntityName })
  }

  removeFileSystemEntity(doc_id: string) {
    return this.firestore
      .collection("systemEntities_____")
      .doc(doc_id)
      .delete()
  }
}