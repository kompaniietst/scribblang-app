import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { LangService, Language } from '../core/services/lang.service';
import { BookmarksProviderService } from '../core/services/bookmarks-provider.service';

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
  isEmpty: boolean = false;

  ionViewWillEnter() {
    console.log('Enter');

  }

  @ViewChild("slidingItem") slidingItem: IonItemSliding;

  constructor(
    private http: HttpService,
    private bookmarkService: BookmarksProviderService,
    private lang: LangService,
    private modalController: ModalController,
  ) {
    this.lang.lang$
      .subscribe(lang => {
        if (!!lang) {
          console.log('lang!!!!', lang);

          this.currLang = lang

          this.bookmarkService.pullAllBookmarks();
        }
      })

    this.bookmarkService.bookmarks$
      .subscribe(x => {
        console.log('bookmarks$ ', x, x.length);
        // this.isEmpty = x.length === 0;
        this.words = x;
      })
  }

  ngOnInit() { }

  shuffle = () =>
    this.words = this.words.sort(() => Math.random() - 0.5);

  closeIonItem = () => this.slidingItem.closeOpened();
}