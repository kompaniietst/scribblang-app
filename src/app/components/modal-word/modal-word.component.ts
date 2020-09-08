import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { NgForm } from '@angular/forms';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import { AngularFireStorage } from '@angular/fire/storage';
import { WordsProviderService } from 'src/app/core/services/words-provider.service';

@Component({
  selector: 'app-modal-word',
  templateUrl: './modal-word.component.html',
  styleUrls: ['./modal-word.component.scss'],
})
export class ModalWordComponent implements OnInit, AfterViewInit {

  @Input() word: Word;
  @Input() mode: 'edit' | 'create' = 'create';

  original = '';
  translation = '';
  transcription = ''

  @ViewChild('input') inputToFocus: ElementRef<any>;

  list_id = this.route.snapshot.queryParams.id;

  constructor(
    public modalController: ModalController,
    private wordService: WordsProviderService,
    private route: ActivatedRoute,
    public toastController: ToastController,
  ) { }

  ngOnInit(): void {
    this.original = this.word?.original || '';
    this.translation = this.word?.translation || '';
    this.transcription = this.word?.transcription || '';
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputToFocus.nativeElement.setFocus(), 400);
  }

  onFormSubmit(form: NgForm, form_value: Partial<Word>) {
    if (this.isEmpty(form_value)) return;

    if (this.mode == 'create')
      this.createWord(form, form_value);

    if (this.mode == 'edit')
      this.editWord(form_value);
  }

  createWord(form: NgForm, value: Partial<Word>) {
    this.wordService.createWord(this.list_id, {
      original: value.original,
      translation: value.translation,
      transcription: value.transcription,
      createdAt: new Date()
    })
      .then(_ => {
        form.reset();
        setTimeout(() => this.inputToFocus.nativeElement.setFocus(), 400);
      });
  }

  editWord(value: Partial<Word>) {
    for (const key in value)
      this.word[key] = value[key]

    this.wordService.editWord(this.word)
      .then(_ => this.modalController.dismiss());
  }

  closeModal = () => this.modalController.dismiss();

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
  
  isEmpty(v) {
    return v.original === "" && v.translation === "" && v.transcription === ""
      || v.original === null && v.translation === null && v.transcription === null
  }
}