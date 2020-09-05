import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import * as firebase from "firebase";
import { LangService, Language } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private recordSubj = new BehaviorSubject(false);
  public recordListener$ = this.recordSubj.asObservable();
  uid: string;
  currLang: Language;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private streamingMedia: StreamingMedia,
    private lang: LangService
  ) {
    console.log('USer', this.auth.getCurrUser());
    this.uid = this.auth.getCurrUser().uid;

    this.lang.lang$
      .subscribe(lang => {
        console.log(' ');
        console.log(' lang$',lang);
        console.log(' ');
        
        this.currLang = lang;
        this.getFileSystemEntities();
      })

  }

  play(list_id: string, id: string) {
    var ref = firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + '/' + id + '.mp3');
    ref.getDownloadURL()
      .then(url => this.streamingMedia.playAudio(url))
  }

  async upload(list_id: string, id: string, str: string) {
    let storageRef = firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + '/' + id + '.mp3');

    try {
      const _ = await storageRef.putString((str as string), 'data_url');
      this.recordSubj.next(true);
      this.getAllRecords(list_id);
    }
    catch (err) {
      console.log(err)
    }
  }

  getAllRecords(list_id: string) {
    return firebase.storage().ref().child("audio/" + this.uid + '/' + list_id).listAll()
  }

  getSingeRecord(list_id: string, id: string) {
    // alert('sigle ' + list_id + ' ' + id)
    return firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + "/" + id + ".mp3")
      .getDownloadURL()

  }

  getWordsBy(list_id: string): Observable<any> {
    return this.firestore
      .collection("words_____", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "==", list_id)
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

  createFileSystemEntity(obj: Partial<FileSystemEntity>, lang: string) {
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
    // .update({ lang: "he_IL" })
  }

  removeFileSystemEntity(doc_id: string, type: string) {
    return this.firestore
      .collection("systemEntities_____")
      .doc(doc_id)
      .delete()
  }

  bookmarkWord(id: string) {
    this.firestore
      .collection("words_____")
      .doc(id)
      .set({ is_bookmarked: true }, { merge: true })
  }

  private bookmSubj: BehaviorSubject<Word[]> = new BehaviorSubject<Word[]>([])
  bookmSubjArr = [];
  bookm$ = this.bookmSubj.asObservable();

  getAllBookmarks() {

    console.log('getAllBookmarks');

    //filter by uid
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
        console.log('words=', words);

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