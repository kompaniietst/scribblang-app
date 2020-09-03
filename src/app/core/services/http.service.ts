import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
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
    this.lang.lang$
      .subscribe(lang => {
        this.getFileSystemEntities(lang)
      })
  }

  play(list_id: string, id: string) {
    var ref = firebase.storage().ref().child("audio/" + list_id + '/' + id + '.mp3');
    ref.getDownloadURL()
      .then(url => {
        this.streamingMedia.playAudio(url);
      })
  }

  async upload(list_id: string, id: string, str: string) {
    alert(list_id + '/' + id + '.mp3');
    let storageRef = firebase.storage().ref().child("audio/" + list_id + '/' + id + '.mp3');

    try {
      const _ = await storageRef.putString((str as string), 'data_url');
      this.recordSubj.next(true);
      alert('upload');
      this.getAllRecords(list_id);
    }
    catch (err) {
      alert('err');
      alert(JSON.stringify(err));
    }
  }

  getAllRecords(list_id: string) {
    return firebase.storage().ref().child("audio/" + list_id).listAll()
  }

  getWordsBy(list_id: string): Observable<any> {
    return this.firestore
      .collection("words_____", ref => ref
        .orderBy("createdAt", "desc")
        .where("list_id", "==", list_id))
      .snapshotChanges()
  }

  createWord(list_id: string, word: Partial<Word>) {
    var newWord = Object.assign({ list_id: list_id }, word);

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

  getFileSystemEntities(lang: string) {
    var uid = this.auth.getCurrUserUid();

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
}

