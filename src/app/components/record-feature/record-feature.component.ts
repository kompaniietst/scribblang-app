import { Component, OnInit, Input } from '@angular/core';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Word } from 'src/app/core/models/Word';
import { HttpService } from 'src/app/core/services/http.service';
import { LangService } from 'src/app/core/services/lang.service';
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
  recordExist: boolean = false;

  recordUrl = '';

  constructor(
    private tts: TextToSpeech,
    private streamingMedia: StreamingMedia,
    private http: HttpService,
    private auth: AuthService,
    private lang: LangService,
    private modalController: ModalController
  ) {
    this.uid = this.auth.getCurrUserUid();

  }

  ngOnInit() {
    console.log(' ');
    console.log(' ');

    // this.ifRecordExist(this.item.list_id, this.item.id);

    // words.forEach(w => {
    this.http.getSingeRecord(this.item.list_id, this.item.id)
      .then(x => {
        // alert('firebase => ' + JSON.stringify(x));
        this.recordUrl = x;
        this.recordExist = true;
      }).catch(x => {
        // alert('err ' + JSON.stringify(x));
      });
    // });

  }

  playRecorded = (id: string) => this.streamingMedia.playAudio(this.recordUrl);

  addAudio = (id: string) => {
    this.presentModal({ id: id }, "modal-add-audio", ModalAudioComponent);
  }

  async presentModal(prop: {}, className: string, component) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: className,
      componentProps: prop
    });
    return await modal.present();
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

  // ifRecordExist(id: string) {
  //   if (this.allRecords.length > 0) {
  //     console.log(this.allRecords.some(x => x.includes('2FRcSdzXCaQI78s0oFv7jm')));

  //   }
  //   return this.allRecords.some(x => x.includes('2FRcSdzXCaQI78s0oFv7jm'))
  // }

  /* 
    ifRecordExist(list_id: string, id: string) {
      // console.log('ifRecordExist', list_id, id);
  
      this.http.getSingeRecord(list_id, id)
        .then(x => {
          // console.log('recsSSSsss ', x);
  
          // var url = x.items.map(x => x.toString()).find(x => x.includes(w.id));
          // console.log(url);
  
          // if (x) console.log('uuurrrrlll ', x)
          // this.http.play(list_id, id);
  
        }).catch(x => {
          // console.log(x);
        });
  
      return true;
    }
   */


  /* 
    getAllRecords(words: Word[]) {
      // var res = [];
  
      words.map(w => {
        console.log('w', w);
  
  
        // var url = "";
  
        this.http.getSingeRecord(w.list_id, w.id)
          .then(x => {
            // console.log('recsSSSsss ', x);
  
            // var url = x.items.map(x => x.toString()).find(x => x.includes(w.id));
            // console.log(url);
  
            if (x) console.log('uuurrrrlll ', x)
            // this.http.play(list_id, id);
  
          }).catch(x => {
            console.log(x);
          });
  
        // return res;
      })
  
      // console.log('res => ', res);
  
    } */
}
