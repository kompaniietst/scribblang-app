import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalController } from '@ionic/angular';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { LangService } from '../core/services/lang.service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  words: Word[] = [];
  openedTranslations: string[] = [];
  allRecords = [];

  isTtsActive: boolean;

  currLang: string;

  ionViewWillEnter() {
    console.log(
      'Enter'
    );
    this.lang.lang$
      .subscribe(lang => {
        if (!!lang) {
          console.log('lang!!!!', lang);

          this.currLang = lang

          this.http.getAllBookmarks(lang);

          // this.http.getAllBookmarks(lang).then(x => {
          //   var res = x.docs.map(item => {
          //     return {
          //       id: item.id,
          //       original: item.data()["original"],
          //       translation: item.data()["translation"],
          //       transcription: item.data()["transcription"],
          //       createdAt: item.data()["createdAt"],
          //       list_id: item.data()["list_id"],
          //       is_bookmarked: item.data()["is_bookmarked"],
          //       lang: item.data()["lang"],
          //       uid: item.data()["uid"],
          //     }
          //   })
          //   console.log('BOOKwords ', res);
          //   this.words = res;
          //   // this.WS = this.words;
          //   // this.WSS.next([...this.WS]);
          // })
        }
      })


  }



  constructor(
    private http: HttpService,
    private lang: LangService,

    private modalController: ModalController,
  ) {


    // this.isTtsActive =this.lang.checkIfTTSActive();





      this.http.bookm$
        .subscribe(x => {
          console.log('bookm$ ', x);
          this.words = x;

          var words = x;

 



        })


  }



  ngOnInit() { }

  toggleTranslation = (id: string) => {
    this.openedTranslations.includes(id)
      ? this.closeTranslation(id)
      : this.openTranslation(id)
  }

  openTranslation(id: string) {
    this.openedTranslations.push(id);
  }

  closeTranslation(id: string) {
    var i = this.openedTranslations.indexOf(id);
    console.log(i);

    this.openedTranslations.splice(i, 1);
  }

  isTranslationOpened(id: string) {
    return this.openedTranslations.includes(id);
  }



  unBookmark(id: string) {
    this.http.unBookmark(id);
  }

  edit = async (word: Word) => {
    const modal = await this.modalController.create({
      component: ModalWordComponent,
      cssClass: "modal-edit-word",
      componentProps: { word: word, mode: 'edit' }
    });
    return await modal.present();
  }


  shuffle() {
    this.words = this.words.sort(() => Math.random() - 0.5)
  }
}