import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as firebase from 'firebase';
import { Language, LangService } from './lang.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordsProviderService {

  private recordsSubj: ReplaySubject<{ word_id: string, url: string }[]> = new ReplaySubject();
  records$ = this.recordsSubj.asObservable();
  recArr: { word_id: string, url: string }[] = [];

  uid: string;
  currLang: Language;

  constructor(
    private auth: AuthService,
    private lang: LangService,
  ) {
    this.auth.user$
      .subscribe(user => this.uid = user?.uid)

    this.lang.lang$
      .subscribe(lang => this.currLang = lang)
  }

  async upload(list_id: string, id: string, str: string) {
    
    let storageRef = firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + '/' + id + '.mp3');

    try {
      const _ = await storageRef.putString((str as string), 'data_url');
      this.pullRecordsByList(list_id);
    }
    catch (err) {
      console.log(err)
    }
  }

  async pullRecordsByList(list_id: string) {
    try {
      const allRecords = await firebase.storage().ref().child("audio/" + this.uid + '/' + list_id).listAll();

      allRecords.items.map(rec => {
        var word_id = rec.fullPath.split(/[\s/]+/).pop().split(/[\s.]+/).shift();

        rec.getDownloadURL()
          .then(url => {
            this.recArr.push({ word_id: word_id, url: url });
            this.recordsSubj.next([...this.recArr]);
          });
      });
    }
    catch (err) {
      return console.log(err);
    }
  }

  async getSingeRecord(list_id: string, id: string) {
    return firebase.storage().ref()
      .child("audio/" + this.uid + '/' + list_id + "/" + id + ".mp3")
      .getDownloadURL()
  }
}
