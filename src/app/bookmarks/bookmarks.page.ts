import { Component, ViewChild } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Word } from '../core/models/Word';
import { LangService, Language } from '../core/services/lang.service';
import { BookmarksProviderService } from '../core/services/bookmarks-provider.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage {

  words: Word[] = [];

  currLang: Language;
  isEmpty: boolean = false;

  @ViewChild("slidingItem") slidingItem: IonItemSliding;

  constructor(
    private bookmarkService: BookmarksProviderService,
    private lang: LangService,
  ) {
    this.lang.lang$.subscribe(lang => {
      if (!!lang) {
        this.currLang = lang
        this.bookmarkService.pullAllBookmarks();
      }
    })

    this.bookmarkService.bookmarks$
      .subscribe(x => this.words = x)
  }

  shuffle = () =>
    this.words = this.words.sort(() => Math.random() - 0.5);

  closeIonItem = () => this.slidingItem.closeOpened();
}