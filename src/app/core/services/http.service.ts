import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import * as firebase from "firebase";
import { LangService } from './lang.service';
import { unescapeIdentifier } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private recordSubj = new BehaviorSubject(false);
  public recordListener$ = this.recordSubj.asObservable();
  uid: string;
  currLang: string;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private streamingMedia: StreamingMedia,
    private lang: LangService
  ) {
    this.lang.lang$
      .subscribe(lang => {
        this.currLang = lang;
        this.getFileSystemEntities(lang)
      })

    this.auth.user$
      .subscribe(x => this.uid = x.uid)
    // this.uid = this.auth.getCurrUserUid();
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
      // .collection("words", ref => ref
      .collection("words_____", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "==", list_id)
      )
      .snapshotChanges()
  }

  createWord(list_id: string, word: Partial<Word>) {

    var newWord = Object.assign(
      { list_id: list_id, uid: this.uid, lang: this.currLang }, word);

    return this.firestore
      .collection("words_____")
      .add(newWord)
  }

  //   editWord2(list_id) {
  //     this.firestore
  //       .collection("words", ref => ref
  //         // .collection("words_____", ref => ref
  //         // .orderBy("createdAt", "desc")
  //         .where("list_id", "==", list_id))
  //       .snapshotChanges()
  //       .subscribe(x => {
  //         console.log('WD ', x)

  //         x.forEach(w => {

  //           var word = Object.assign(
  //             { id: w.payload.doc.id },
  //             w.payload.doc.data(),
  //             { lang: this.currLang, uid: this.uid }
  //           ) as Word;

  //           console.log('w,',word);

  // this.editWord(word)

  //         })
  //       })
  //   }

  editWord(word: Word): Promise<any> {
    // word["uid"] = this.uid;
    // word["lang"] = this.currLang;
    // word["lang"] = this.currLang;

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

  getFileSystemEntities(lang: string) {
    var uid = this.auth.getCurrUserUid();

    // return firebase.firestore().collection("systemEntities2").orderBy("createdAt", "desc")
    return firebase.firestore().collection("systemEntities_____").orderBy("createdAt", "desc")
      .where("uid", "==", uid)
      .where("lang", "==", lang)
  }

  createFileSystemEntity(obj: Partial<FileSystemEntity>, lang: string) {
    var uid = this.auth.getCurrUserUid();

    obj["createdAt"] = new Date();
    obj["uid"] = uid;
    obj["lang"] = lang;

    return this.firestore
      .collection("systemEntities_____")
      .add(obj)
      .then(() => {
        // this.saveSystEntIdToUsersColl(resp.id);
        this.getFileSystemEntities(lang);
      });
  }


  // saveSystEntIdToUsersColl(list_id) {
  //   var uid = this.auth.getCurrUserUid();

  //   this.firestore
  //     .collection("users")
  //     .doc(uid)
  //     .set({ list_id: list_id }, { merge: true })
  // }

  editFileSystemEntity(doc_id: string, systemEntityName: string) {
    // return this.firestore
    //   .collection("systemEntities_____")
    //   .doc(doc_id)
    //   .set({
    //     name: systemEntityName, lang: 'hw', uid: 'S1fo8esA2TNsYuyMmLi6v87wmig1',
    //     type: 'list', path: [""], createdAt: new Date()
    //   }, { merge: true })
    return this.firestore
      .collection("systemEntities_____")
      .doc(doc_id)
      .update({ name: systemEntityName })
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

  getAllBookmarks(lang: string) {
    // console.log('u_i_d', this.uid);
    // console.log('LANG', lang);

    console.log('getAllBookmarks');


    // this.lang.lang$
    //   .subscribe(lang => {
    //   console.log('UOD');

    //   })




    //filter by uid
    return firebase.firestore().collection("words_____")
      .where("uid", "==", this.uid)
      .where("is_bookmarked", "==", true)
      .where("lang", "==", lang)
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




    // return firebase.firestore().collection("words_____")
    //   .where("uid", "==", this.uid)
    // .where("is_bookmarked", "==", true)

  }

  unBookmark(id: string) {
    this.firestore
      .collection("words_____")
      .doc(id)
      .set({ is_bookmarked: false }, { merge: true })
      .then(() => this.getAllBookmarks(this.currLang))
  }
}

  // saveToBookmark(word: Word, lang: string) {
  //   var uid = this.auth.getCurrUserUid();

  //   return this.firestore
  //     .collection("bookmarked")
  //     .doc(word.id)
  //     .set(Object.assign(word, { lang: lang, uid: uid }))
  // }

  // getBookmarks(list_id?: string) {
  //   return list_id

  //     ? this.firestore
  //       .collection("bookmarked", ref => ref
  //         .where("list_id", "==", list_id))
  //       .snapshotChanges()

  //     : this.firestore
  //       .collection("bookmarked")
  //       .snapshotChanges()
  // }
// }

