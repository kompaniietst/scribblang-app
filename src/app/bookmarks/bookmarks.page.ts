import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { ModalController } from '@ionic/angular';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { LangService, Language } from '../core/services/lang.service';

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

  currLang: Language;

  ionViewWillEnter() {
    console.log('Enter');

    this.lang.lang$
      .subscribe(lang => {
        if (!!lang) {
          console.log('lang!!!!', lang);

          this.currLang = lang

          this.http.getAllBookmarks();
        }
      })
  }

  constructor(
    private http: HttpService,
    private lang: LangService,
    private modalController: ModalController,
  ) {

    this.http.bookm$
      .subscribe(x => {
        console.log('bookm$ ', x);
        this.words = x;
      })
  }

  ngOnInit() { }

  toggleTranslation = (id: string) =>
    this.openedTranslations.includes(id)
      ? this.closeTranslation(id)
      : this.openTranslation(id)

  openTranslation = (id: string) =>
    this.openedTranslations.push(id);

  closeTranslation = (id: string) => {
    var i = this.openedTranslations.indexOf(id);
    this.openedTranslations.splice(i, 1);
  }

  isTranslationOpened = (id: string) =>
    this.openedTranslations.includes(id);

  unBookmark = (id: string) =>
    this.http.unBookmark(id);

  edit = async (word: Word) => {
    const modal = await this.modalController.create({
      component: ModalWordComponent,
      cssClass: "modal-edit-word",
      componentProps: { word: word, mode: 'edit' }
    });
    return await modal.present();
  }

  shuffle = () =>
    this.words = this.words.sort(() => Math.random() - 0.5)
}