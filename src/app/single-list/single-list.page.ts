import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import * as firebase from "firebase";
import { LangService, Language } from '../core/services/lang.service';

@Component({
  selector: 'single-list',
  templateUrl: 'single-list.page.html',
  styleUrls: ['single-list.page.scss']
})
export class SingleListPage implements OnInit {

  words$: Observable<Word[]>;

  list_id: string = this.route.snapshot.queryParams.id;
  list_name: string;

  currLang: string;
  // recordUrls: { word_id: string, url: string }[] = [];

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private lang: LangService,
  ) {

    this.lang.lang$
      .pipe(tap(x => console.log('lang in lists', x)))
      .subscribe((lang: Language) => this.currLang = lang.label);

    this.list_name = this.route.snapshot.queryParams.name;

    this.getRecord();



  }

  func(id){
    // console.log('FFFAFAFAAFFAAFAFA');
    // console.log('recordUrls',this.recordUrls);
    
  }

  ngOnInit(): void {

    if (this.list_id)
      this.words$ = this.http.getWordsBy(this.list_id)
        .pipe(
          map((res: any) => {
            var r = res.map((x: any) =>
              Object.assign({ id: x.payload.doc.id }, x.payload.doc.data()))

            console.log('R', r);
            /*   
              r.forEach(el => {
                // console.log('el',el);
                
                  this.http.editWord(el)
              }); */


            return r;
          }

          ),
          tap((w: Word[]) => console.log('w', w)))
  }

  getRecord() {



    // this.http.getSingeRecord(this.item.list_id, this.item.id)
    //   .then(x => {
    //     this.recordUrl = x;
    //     this.recordExist = true;
    //   })
    //   .catch(() => console.log())
    this.http.getRecordsByList(this.list_id)

  }

  shuffle() {
    this.words$ = this.words$
      .pipe(map(words =>
        words.sort(() => Math.random() - 0.5)
      ))
  }

  // recordUrlIfExist(id: string) {
  //   console.log('======', this.recordUrls);

  // }
}
