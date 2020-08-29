import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Word } from '../models/Word';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore) {
    this.getFileSystemEntities();
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

  removeWord(word_id: string) {
    this.firestore
      .collection("words")
      .doc(word_id)
      .delete()
    // .then(() => console.log(word.word, ' REMOVED'))
  }

  // getLists(): Observable<any> {
  //   return this.firestore
  //     .collection("systemEntities2", ref => ref
  //       .where("type", "==", "list"))
  //     .snapshotChanges()
  // }

  getFileSystemEntities() {
    var uid = this.auth.getCurrUserUid();
    console.log('uid get', uid);


    return this.firestore
      .collection("systemEntities2", ref => ref
        .orderBy("createdAt", "desc")
        .where("uid", "==", uid))
      .snapshotChanges()
  }

  createFileSystemEntity(obj: Partial<FileSystemEntity>) {
    var uid = this.auth.getCurrUserUid();

    obj["createdAt"] = new Date();
    obj["uid"] = this.auth.getCurrUserUid();

    return this.firestore
      .collection("systemEntities2")
      .add(obj)
      .then(resp => {
        // if (obj.type == "list")
          // this.saveListToListsCollection(resp.id, obj);

        this.saveSystEntIdToUsersColl(resp.id);
        this.getFileSystemEntities()
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

