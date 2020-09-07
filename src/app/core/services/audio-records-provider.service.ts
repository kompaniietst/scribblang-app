import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as firebase from 'firebase';
import { Language, LangService } from './lang.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordsProviderService {

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
      .subscribe(lang => this.currLang = lang)
  }

  async upload(list_id: string, id: string, str: string) {
    let storageRef = firebase.storage().ref().child("audio/" + this.uid + '/' + list_id + '/' + id + '.mp3');

    try {
      const _ = await storageRef.putString((str as string), 'data_url');
      // this.recordSubj.next(true);
      this.pullRecordsByList(list_id);
    }
    catch (err) {
      console.log(err)
    }
  }

  private recordsSubj: ReplaySubject<{ word_id: string, url: string }[]> = new ReplaySubject();
  records$ = this.recordsSubj.asObservable();
  recArr: { word_id: string, url: string }[] = [];


  pullRecordsByList(list_id: string) {

    return firebase.storage().ref().child("audio/" + this.uid + '/' + list_id).listAll()
      .then(x => {
        x.items.map(r => {

          var word_id = r.fullPath.split(/[\s/]+/).pop().split(/[\s.]+/).shift();
          r.getDownloadURL()
            .then(url => {

              this.recArr.push({ word_id: word_id, url: url });
              this.recordsSubj.next([...this.recArr]);
              // alert('TYPEOF ' + typeof this.arr);

              // alert('URL ' + url);
              // console.log('URL ', this.recordUrls);
            })
        })
      })
      .catch(err => console.log(err))
  }
}
