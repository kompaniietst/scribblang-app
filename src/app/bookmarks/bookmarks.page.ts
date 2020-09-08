import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { LangService, Language } from '../core/services/lang.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage  {

  words: Word[] = [];
  openedTranslations: string[] = [];
  allRecords = [];

  isTtsActive: boolean;

  currLang: Language;

  ionViewWillEnter() {
    console.log('Enter');

  }

  @ViewChild("slidingItem") slidingItem: IonItemSliding;

  constructor(
    private http: HttpService,
    // private bookmarkService: BookmarksProviderService,
    private lang: LangService,
    private modalController: ModalController,
  ) {
    this.lang.lang$
      .subscribe(lang => {
        if (!!lang) {
          console.log('lang!!!!', lang);

          this.currLang = lang

          this.http.getAllBookmarks();
        }
      })

    this.http.bookm$
      .subscribe(x => {
        console.log('bookm$ ', x);
        this.words = x;
      })
  }

  ngOnInit() { }

  shuffle = () =>
    this.words = this.words.sort(() => Math.random() - 0.5);

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
 
}