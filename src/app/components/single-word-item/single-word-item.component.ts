import { Component, OnInit, Input } from '@angular/core';
import { Word } from 'src/app/core/models/Word';
import { ToastController, ModalController, IonItemSliding } from '@ionic/angular';
import { LangService, Language } from 'src/app/core/services/lang.service';
import { ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HttpService } from 'src/app/core/services/http.service';
import { ModalWordComponent } from '../modal-word/modal-word.component';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';

@Component({
  selector: 'app-single-word-item',
  templateUrl: './single-word-item.component.html',
  styleUrls: ['./single-word-item.component.scss'],
})
export class SingleWordItemComponent implements OnInit {

  @Input() item: Word;
  // bookmarkedWords: Word[];

  openedTranslations: string[] = [];

  list_id: string = this.route.snapshot.queryParams.id;
  list_name: string;
  currPageisBookmarks: boolean;

  allRecords;

  currLang: Language;
  // isBookmarked = this.item.is_bookmarked;

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private tts: TextToSpeech,
    private lang: LangService,
    private toastController: ToastController
  ) {
    this.currLang = this.lang.getCurrLang();
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

  bookmark(id: string) {
    // this.checkIfBookmark(id)
    // this.isBookmarked
    this.item.is_bookmarked
      ? this.http.unBookmark(id)
      : this.http.bookmarkWord(id)

    // this.http.saveToBookmark(word, this.currLang)
    //   .then(() => this.presentToast(`${name} was bookmarked`, 'success'))
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  edit = (word: Word) =>
    this.presentModal(
      { word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);

  addAudio = (id: string, slidingItem?: IonItemSliding) => {
    slidingItem?.close();
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

  playRecorded = (id: string) => this.http.play(this.list_id, id);

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

  // checkIfBookmark(word_id: string) {
  //   return this.bookmarkedWords.some(w => w.id === word_id);
  // }


}
