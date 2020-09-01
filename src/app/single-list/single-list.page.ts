import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { ModalWordComponent } from 'src/app/components/modal-word/modal-word.component';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalAudioComponent } from '../components/modal-audio/modal-audio.component';

import * as firebase from "firebase";

@Component({
  selector: 'single-list',
  templateUrl: 'single-list.page.html',
  styleUrls: ['single-list.page.scss']
})
export class SingleListPage implements OnInit {

  words$: Observable<Word[]>;

  openedTranslations: string[] = [];

  list_id: string = this.route.snapshot.queryParams.id;
  list_name: string;
  currPageisBookmarks: boolean;

  allRecords;

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private tts: TextToSpeech
  ) {

    this.http.recordListener$
      .subscribe(x => {


        this.http.getAllRecords(this.list_id)
          .then(x => {
            this.allRecords = x.items.map(x => x.toString());
          }).catch(x => {
            console.log(x);
          });

      }

      )

    this.list_name = this.route.snapshot.queryParams.name;
    this.currPageisBookmarks = Object.keys(this.route.snapshot.queryParams).length === 0;
  }

  ngOnInit(): void {

    // if (this.currPageisBookmarks)
    //   this.list_name = "Bookmarked wods";

    if (this.list_id) {
      this.words$ = this.http.getWordsBy(this.list_id)
        .pipe(
          map((res: any) => {
            return res.map((x: any) =>
              Object.assign({ id: x.payload.doc.id }, x.payload.doc.data()))
          }),
          tap((w: Word[]) => console.log('words ', w)))
    }
  }

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
  toBookmark(id: string) {

  }





  edit = (word: Word) =>
    this.presentModal(
      { word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);

  addAudio = (id: string, slidingItem: IonItemSliding) => {
    slidingItem.close();
    this.presentModal({ id: id }, "modal-add-audio", ModalAudioComponent);
  }

  remove = (word_id: string) => this.http.removeWord(this.list_id, word_id)

  async presentModal(prop: {}, className: string, component) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: className,
      componentProps: prop
    });
    return await modal.present();
  }

  say = (id: string) => this.http.play(this.list_id, id);

  ifRecordExist(id: string) {
    if (this.allRecords)
      return this.allRecords.some(x => x.includes(id))
  }

  // say(string: string) {
  //   this.tts.speak({
  //     text: string,
  //     rate: 0.85
  //   })
  //     .then(x => console.log(string))
  //     .catch(x => console.log(string))
  // }
}
