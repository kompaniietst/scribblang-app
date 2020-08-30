import { Component } from '@angular/core';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss']
})
export class GamePage {
  status: string = "";
  audioFile: MediaObject;

  constructor(private media: Media, private file: File) { }

  ngOnInit(): void { }

  RecordAudio() {
    this.audioFile = this.media.create(this.file.externalRootDirectory + '/audiofile.mp3');
    this.audioFile.startRecord();
    this.status = "Rocording...";
  }

  StopRecording() {
    this.audioFile.stopRecord();
    this.status = "Stop";
  }


}