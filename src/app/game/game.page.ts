import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss']
})
export class GamePage {

  constructor(private tts: TextToSpeech) { }

  ngOnInit(): void { }
  do(){
    this.tts.speak('Good morning');
  }
}