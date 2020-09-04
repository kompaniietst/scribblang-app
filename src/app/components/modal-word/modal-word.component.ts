import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { NgForm } from '@angular/forms';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import { Md5 } from 'ts-md5/dist/md5';
import { AngularFireStorage } from '@angular/fire/storage';

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

  status: string = "";
  audioFile: MediaObject;

  md5 = new Md5();

  constructor(
    public modalController: ModalController,
    private http: HttpService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    private media: Media,
    private file: File,
    private platform: Platform,
    private str: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    console.log('diter word', this.word);

    this.original = this.word?.original || '';
    this.translation = this.word?.translation || '';
    this.transcription = this.word?.transcription || '';
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputToFocus.nativeElement.setFocus(), 400);
  }

  onFormSubmit(form: NgForm, form_value: Partial<Word>) {console.log(form_value);
  
    if (form_value.original === "" && form_value.translation === "" && form_value.transcription === ""
    || form_value.original === null && form_value.translation === null && form_value.transcription === null)
      return;

    if (this.mode == 'create')
      this.createWord(form, form_value);

    if (this.mode == 'edit')
      this.editWord(form_value);
  }

  createWord(form: NgForm, value: Partial<Word>) {
    this.http.createWord(this.list_id, {
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

    this.http.editWord(this.word)
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
}