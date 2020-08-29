import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { ModalController } from '@ionic/angular';
import { ModalWordComponent } from 'src/app/components/modal-word/modal-word.component';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'single-list',
  templateUrl: 'single-list.page.html',
  styleUrls: ['single-list.page.scss']
})
export class SingleListPage implements OnInit {

  words$: Observable<Word[]>;

  openedTranslations: string[] = [];

  list_id: string;
  list_name: string;
  currPageisBookmarks: boolean;

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private tts: TextToSpeech
  ) {

    this.list_id = this.route.snapshot.queryParams.id;
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

  edit = (word: Word) => this.presentModalEditWord(word);

  remove = (word_id: string) => this.http.removeWord(word_id)

  async presentModalEditWord(word: Word) {
    const modal = await this.modalController.create({
      component: ModalWordComponent,
      cssClass: 'modal-edit-word',
      componentProps: { word: word, mode: 'edit' }
    });
    return await modal.present();
  }

  say(string: string) {
    this.tts.speak({
      text: string,
      rate: 0.85
    })
      .then(x => console.log(string))
      .catch(x => console.log(string))
  }
}
