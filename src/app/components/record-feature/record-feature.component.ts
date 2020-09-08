import { Component, OnInit, Input } from '@angular/core';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Word } from 'src/app/core/models/Word';
import { HttpService } from 'src/app/core/services/http.service';
import { LangService, Language } from 'src/app/core/services/lang.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalAudioComponent } from '../modal-audio/modal-audio.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-record-feature',
  templateUrl: './record-feature.component.html',
  styleUrls: ['./record-feature.component.scss'],
})
export class RecordFeatureComponent implements OnInit {

  @Input() item: Word;
  @Input('currLang') currLang: string;
  uid: string;

  recordUrl: string = '';
  recordExist: boolean = false;


  constructor(
 
    private http: HttpService,
    private auth: AuthService,
    private lang: LangService,
    private modalController: ModalController
  ) {
    this.uid = this.auth.getCurrUser().uid;

    this.lang.lang$
      .subscribe((l: Language) => {
        if (!l.ttsActive && !!this.item)
          this.getRecord();
      })
  }

  ngOnInit() { }

  getRecord() {
    // this.http.getSingeRecord(this.item.list_id, this.item.id)
    //   .then(x => {
    //     // this.recordUrl = x;
    //     // this.recordExist = true;
    //   })
  }


}
