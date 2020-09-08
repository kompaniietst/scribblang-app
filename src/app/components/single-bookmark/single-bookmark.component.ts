import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LangService, Language } from 'src/app/core/services/lang.service';
import { ModalWordComponent } from '../modal-word/modal-word.component';
import { Word } from 'src/app/core/models/Word';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';
import { AudioRecordsProviderService } from 'src/app/core/services/audio-records-provider.service';
import { BookmarksProviderService } from 'src/app/core/services/bookmarks-provider.service';

@Component({
  selector: 'app-single-bookmark',
  templateUrl: './single-bookmark.component.html',
  styleUrls: ['./single-bookmark.component.scss'],
})
export class SingleBookmarkComponent implements OnInit {

  @Input() item: Word;
  @Output() closeItem = new EventEmitter<boolean>(false);

  openedTranslations: string[] = [];

  currLang: Language;

  recordUrl: string = "";
  recordExist: boolean = false;

  constructor(
    private audioService: AudioRecordsProviderService,
    private bookmarkService: BookmarksProviderService,
    private lang: LangService,
    private modalController: ModalController,
    private tts: TextToSpeech,
    private streamingMedia: StreamingMedia,
  ) {
    this.lang.lang$.subscribe(lang => {
      if (!!lang) this.currLang = lang;
    })
  }

  ngOnInit() {
    this.getWordAudioRecord();
  }

  getWordAudioRecord = () => {
    this.audioService.getSingeRecord(this.item.list_id, this.item.id)
      .then((url: string) => {
        this.recordUrl = url;
        this.recordExist = !!url;
      })
      .catch(() => console.log())
  }

  playRecorded = () =>
    this.streamingMedia.playAudio(this.recordUrl);

  callRecordAudioModal = (id: string) => {
    this.presentModal({ id: id }, "modal-add-audio", ModalAudioComponent);
    this.closeItem.emit(true);
  }

  speek = (string: string) =>
    this.tts.speak({ text: string, rate: 0.85 })

  unBookmark = (id: string) => {
    this.bookmarkService.unBookmark(id)
  }

  callEditWordModal = async (word: Word) => {
    this.presentModal({ word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);
    this.closeItem.emit(true);
  }

  async presentModal(prop: {}, className: string, component) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: className,
      componentProps: prop
    });
    return await modal.present();
  }

  toggleTranslation = (id: string) => {
    this.openedTranslations.includes(id)
      ? this.closeTranslation(id)
      : this.openTranslation(id)
  }

  openTranslation = (id: string) => {
    this.openedTranslations.push(id);
  }

  closeTranslation = (id: string) => {
    var i = this.openedTranslations.indexOf(id);
    this.openedTranslations.splice(i, 1);
  }

  isTranslationOpened = (id: string) => {
    return this.openedTranslations.includes(id);
  }
}
