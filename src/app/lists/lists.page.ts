import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage {

  constructor(private tts: TextToSpeech) {
    
  }

  do(){
    this.tts.speak('Hello World')
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }
}
