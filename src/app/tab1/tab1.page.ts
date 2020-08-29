import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private tts: TextToSpeech) {
    
  }

  do(){
    this.tts.speak('Hello World')
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }
}
