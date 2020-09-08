import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/core/models/Word';
import { ToastController, ModalController } from '@ionic/angular';
import { LangService, Language } from 'src/app/core/services/lang.service';
import { ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { WordsProvideService } from 'src/app/core/services/words-provider.service';
import { ModalWordComponent } from '../modal-word/modal-word.component';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AudioRecordsProviderService } from 'src/app/core/services/audio-records-provider.service';
import { BookmarksProviderService } from 'src/app/core/services/bookmarks-provider.service';
import { FileSystemProviderService } from 'src/app/core/services/file-system-provider.service';

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

  @Output() closeItem = new EventEmitter<boolean>(false);

  constructor(
    public modalController: ModalController,
    private wordService: WordsProvideService,
    private route: ActivatedRoute,
    private tts: TextToSpeech,
    private lang: LangService,
    private toastController: ToastController,
    private streamingMedia: StreamingMedia,
    private audioService: AudioRecordsProviderService,
    private bookmarkService: BookmarksProviderService,
    private fileService: FileSystemProviderService
  ) {
    this.currLang = this.lang.getCurrLang();
  }

  ngOnInit() {
    this.getWordAudioRecord();
  }

  getWordAudioRecord() {
    this.audioService.records$
      .subscribe(x => {
        if (this.item) {
          var rec = x.find(r => r.word_id == this.item.id);
          this.recordExist = !!rec;
          this.recordUrl = rec?.url;
        }
      })
  }

  playRecorded = (id: string) =>
    this.streamingMedia.playAudio(this.recordUrl);

  callRecordAudioModal = (id: string) => {
    this.closeItem.emit(true);
    this.presentModal({ id: id }, "modal-add-audio", ModalAudioComponent);
  }

  speek = (string: string) =>
    this.tts.speak({ text: string, rate: 0.85 })

  bookmark = (id: string) => {
    this.item.is_bookmarked
      ? this.bookmarkService.unBookmark(id)
      : this.bookmarkService.bookmarkWord(id)
  }

  callEditWordModal = (word: Word) => {
    this.closeItem.emit(true);
    this.presentModal({ word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);
  }

  removeWord = (word_id: string) => this.wordService.removeWord(this.list_id, word_id)

  get initColumnSize() {
    if (this.currLang.ttsActive) return 4;
    return this.recordExist && !this.currLang.ttsActive ? 4 : 6;
  }

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
}
