import { Component, ViewChild } from '@angular/core';
import { WordsProvideService } from 'src/app/core/services/words-provider.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AudioRecordsProviderService } from '../core/services/audio-records-provider.service';

@Component({
  selector: 'single-list',
  templateUrl: 'single-list.page.html',
  styleUrls: ['single-list.page.scss']
})
export class SingleListPage {

  words$: Observable<Word[]>;
  list_name: string;
  list_id = this.route.snapshot.queryParams.id;
  isEmpty: boolean = false;

  @ViewChild("slidingItem") ioninp: IonItemSliding;

  constructor(
    private wordService: WordsProvideService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private audioService: AudioRecordsProviderService
  ) {
    this.getListName();
    this.getWords();
    this.audioService.pullRecordsByList(this.list_id);
  }

  getListName = () =>
    this.list_name = this.route.snapshot.queryParams.name;

  getWords = () => {
    if (this.list_id)
      this.words$ = this.wordService.getWordsBy(this.list_id)
        .pipe(
          map((res: any) =>
            res.map((x: any) =>
              Object.assign({ id: x.payload.doc.id }, x.payload.doc.data()))),
          tap((w: Word[]) => console.log('w', w)))
  }

  shuffle = () =>
    this.words$ = this.words$
      .pipe(map(words =>
        words.sort(() => Math.random() - 0.5)
      ))

  closeIonItem = () => this.ioninp.closeOpened()

  reverseTranslation() {
    this.words$ = this.words$
      .pipe(map((words: Word[]) => {
        words.forEach(w => {
          var tmp = w.original;
          w.original = w.translation;
          w.translation = tmp;
        })

        return words
      }))
  }
}
