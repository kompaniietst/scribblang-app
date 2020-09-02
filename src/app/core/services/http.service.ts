import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { map, tap } from 'rxjs/operators';
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import * as firebase from "firebase";
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private recordSubj = new BehaviorSubject(false);
  public recordListener$ = this.recordSubj.asObservable();

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private streamingMedia: StreamingMedia,
    private lang: LangService
  ) {
    this.getFileSystemEntities('en');
  }

  play(list_id: string, id: string) {
    var ref = firebase.storage().ref().child(list_id + '/' + id + '.mp3');
    ref.getDownloadURL()
      .then(url => {

        let options: StreamingAudioOptions = {
          initFullscreen: false,
          // bgColor: '#ff0000',
          successCallback: () => { console.log('Audio played') },
          errorCallback: (e) => { console.log('Error streaming') }
        };

        this.streamingMedia.playAudio(url, options);
      })
  }

  upload(list_id: string, id: string, str: string) {
    let storageRef = firebase.storage().ref().child(list_id + '/' + id + '.mp3');

    return storageRef.putString(str as string, 'data_url')
      .then(_ => {
        this.recordSubj.next(true);
        alert('upload');
      });
  }

  getAllRecords(list_id: string) {
    return firebase.storage().ref().child(list_id).listAll()
  }

  getWordsBy(list_id: string): Observable<any> {
    return this.firestore
      .collection("words", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "==", list_id))
      .snapshotChanges()
  }

  createWord(list_id: string, word: Partial<Word>) {
    var newWord = Object.assign({ list_id: list_id }, word);

    return this.firestore
      .collection("words")
      .add(newWord)
    // .then(() => console.log('Created word'))
  }

  editWord(word: Word): Promise<any> {
    return this.firestore
      .collection("words")
      .doc(word.id)
      .set(word)
  }

  removeWord(list_id: string, word_id: string) {
    console.log(list_id, word_id);

    this.firestore
      .collection("words")
      .doc(word_id)
      .delete()
    // .then(() => console.log(word.word, ' REMOVED'))


    console.log(list_id, word_id);


    var audioRec = firebase.storage().ref().child(list_id + "/" + word_id + ".mp3");

    audioRec.delete().then(function () {
      console.log('removed rec');
    }).catch(function (error) {
      console.log('catch removing rec');
    });
  }

  // getLists(): Observable<any> {
  //   return this.firestore
  //     .collection("systemEntities2", ref => ref
  //       .where("type", "==", "list"))
  //     .snapshotChanges()
  // }

  getFileSystemEntities(lang: string) {
    console.log('l ', lang);

    var uid = this.auth.getCurrUserUid();
    console.log('uid get', uid);


    return firebase.firestore().collection("systemEntities2").orderBy("createdAt", "desc")
      .where("uid", "==", uid)
      .where("lang", "==", lang)

    // query = query.where(...)
    // query = query.where(...)
    // query = query.orderBy(...)
    // query.get().then(...)

    this.firestore
      .collection("systemEntities2", ref => ref
        .orderBy("createdAt", "desc")
        .where("uid", "==", uid))
      .snapshotChanges()
  }

  createFileSystemEntity(obj: Partial<FileSystemEntity>, lang: string) {
    var uid = this.auth.getCurrUserUid();

    obj["createdAt"] = new Date();
    obj["uid"] = this.auth.getCurrUserUid();
    obj["lang"] = lang;

    return this.firestore
      .collection("systemEntities2")
      .add(obj)
      .then(resp => {
        // if (obj.type == "list")
        // this.saveListToListsCollection(resp.id, obj);

        this.saveSystEntIdToUsersColl(resp.id);
        this.getFileSystemEntities(lang);
      });
  }

  // saveListToListsCollection(list_id: string, obj: Partial<FileSystemEntity>) {
  //   this.firestore
  //     .collection("lists2")
  //     .doc(list_id)
  //     .set(obj)
  // }

  saveSystEntIdToUsersColl(list_id) {
    var uid = this.auth.getCurrUserUid();

    this.firestore
      .collection("users")
      .doc(uid)
      .set({ list_id: list_id }, { merge: true })
  }

  editFileSystemEntity(doc_id: string, systemEntityName: string) {
    return this.firestore
      .collection("systemEntities2")
      .doc(doc_id)
      .update({ name: systemEntityName })
  }

  removeFileSystemEntity(doc_id: string) {
    return this.firestore
      .collection("systemEntities2")
      .doc(doc_id)
      .delete()
  }




}

