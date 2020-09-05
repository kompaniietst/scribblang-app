import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { ModalController, IonItemSliding, ToastController } from '@ionic/angular';
import { ModalWordComponent } from 'src/app/components/modal-word/modal-word.component';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TextToSpeech, TTSOptions } from '@ionic-native/text-to-speech/ngx';
import { ModalAudioComponent } from '../components/modal-audio/modal-audio.component';

import * as firebase from "firebase";
import { LangService, Language } from '../core/services/lang.service';

@Component({
  selector: 'single-list',
  templateUrl: 'single-list.page.html',
  styleUrls: ['single-list.page.scss']
})
export class SingleListPage implements OnInit {

  words$: Observable<Word[]>;
  // bookmarkedWords: Word[];


  list_id: string = this.route.snapshot.queryParams.id;
  list_name: string;
  currPageisBookmarks: boolean;

  allRecords;

  currLang: string;

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private tts: TextToSpeech,
    private lang: LangService,
    private toastController: ToastController
  ) {

    this.lang.lang$
      .pipe(tap(x => console.log('lang in lists', x)))
      .subscribe((lang: Language) => this.currLang = lang.label);

    this.http.recordListener$
      .subscribe(() => {

        this.http.getAllRecords(this.list_id)
          .then(x => {
            console.log('recs ', x);

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

    if (this.list_id)
      this.words$ = this.http.getWordsBy(this.list_id)
        .pipe(
          map((res: any) => {
            var r = res.map((x: any) =>
              Object.assign({ id: x.payload.doc.id }, x.payload.doc.data()))

              console.log('R',r);
            /*   
              r.forEach(el => {
                // console.log('el',el);
                
                  this.http.editWord(el)
              }); */
              

            return r;
          }

          ),
          tap((w: Word[]) => {
            // console.log('w', w);

            // this.bookmarkedWords = w.filter(x => x.is_bookmarked)
          }))
  }

  shuffle() {
    // this.words = this.words.sort( () => Math.random() - 0.5) );
    this.words$ = this.words$.pipe(map(words =>
      words.sort(() => Math.random() - 0.5)
    ))
  }

}
