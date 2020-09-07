import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/core/models/Word';
import { ToastController, ModalController, IonItemSliding } from '@ionic/angular';
import { LangService, Language } from 'src/app/core/services/lang.service';
import { ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HttpService } from 'src/app/core/services/http.service';
import { ModalWordComponent } from '../modal-word/modal-word.component';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AudioRecordsProviderService } from 'src/app/core/services/audio-records-provider.service';

@Component({
  selector: 'app-single-word-item',
  templateUrl: './single-word-item.component.html',
  styleUrls: ['./single-word-item.component.scss'],
})
export class SingleWordItemComponent implements OnInit {

  @Input() item: Word;
  @Input() recordUrls: [{ word_id: string, url: string }];

  openedTranslations: string[] = [];

  list_id: string = this.route.snapshot.queryParams.id;

  currLang: Language;
  recordUrl: string = "";
  recordExist: boolean = false;

  @Output() close: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private http: HttpService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private tts: TextToSpeech,
    private lang: LangService,
    private toastController: ToastController,
    private streamingMedia: StreamingMedia,
    private audioService: AudioRecordsProviderService
  ) {
    this.currLang = this.lang.getCurrLang();
  }

  ngOnInit() {
    this.audioService.records$
      .subscribe(x => {
        if (this.item) {
          var rec = x.find(r => r.word_id == this.item.id);
          this.recordExist = !!rec;
          this.recordUrl = rec?.url;
        }
      })
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

  getRecord() {
    /*
        // this.http.getSingeRecord(this.item.list_id, this.item.id)
        //   .then(x => {
        //     this.recordUrl = x;
        //     this.recordExist = true;
        //   })
        //   .catch(() => console.log())
        this.http.getRecordsByList(this.item.list_id)
          .then(x => {
            this.recordUrl = x;
            this.recordExist = true;
          })
          .catch(() => console.log())*/
  }

  bookmark(id: string) {
    this.item.is_bookmarked
      ? this.http.unBookmark(id)
      : this.http.bookmarkWord(id)

    // this.http.saveToBookmark(word, this.currLang)
    //   .then(() => this.presentToast(`${name} was bookmarked`, 'success'))
  }

  edit = (word: Word) => {
    this.close.emit(true);
    this.presentModal({ word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);
  }

  callModalAudio = (id: string) => {
    this.close.emit(true);
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  playRecorded = (id: string) =>
    this.streamingMedia.playAudio(this.recordUrl);

  speek = (string: string) =>
    this.tts.speak({ text: string, rate: 0.85 })
}
