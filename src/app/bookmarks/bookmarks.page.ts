import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  words$: Observable<Word[]>;
  openedTranslations: string[] = [];
  allRecords;

  constructor(private http: HttpService, private tts: TextToSpeech) {

    // this.words$ = this.http.getBookmarks()
    //   .pipe(map(x => x.map(b => b.payload.doc.data()) as Word[]))
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

  // playRecorded = (id: string) => this.http.play(this.list_id, id);

  ifRecordExist(id: string) {
    if (this.allRecords)
      return this.allRecords.some(x => x.includes(id))
  }

  speek(string: string) {
    console.log('speak');

    this.tts.speak({
      text: string,
      rate: 0.85
    })
      .then(x => console.log(string))
      .catch(x => console.log(string))
  }
}