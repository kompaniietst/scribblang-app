import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { FileSystemEntity } from '../models/FileSystemEntity';
import * as firebase from "firebase";
import { LangService, Language } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class FileSystemProviderService {

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
      .subscribe(lang => {
        this.currLang = lang;
        this.getFileSystemEntities();
      })
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