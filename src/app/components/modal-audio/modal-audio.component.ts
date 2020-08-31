import { Component, OnInit, Input } from '@angular/core';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File, Entry } from "@ionic-native/file/ngx";
import { Md5 } from 'ts-md5';
import { Platform } from '@ionic/angular';
import * as firebase from "firebase";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-modal-audio',
  templateUrl: './modal-audio.component.html',
  styleUrls: ['./modal-audio.component.scss'],
})
export class ModalAudioComponent implements OnInit {

  @Input() id: string;
  list_id: string = this.route.snapshot.queryParams.id;

  status: string = "";
  audioFile: MediaObject;
  md5 = new Md5();

  recordingNow: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private media: Media,
    private file: File,
    private platform: Platform,

    private http: HttpService
  ) { }

  public press: number = 0;
  pressEvent(e) {
    console.log('press');

    this.press++;
    console.log(this.press);

  }

  holdCount() {
    console.log('press');

    this.press++;
    console.log(this.press);

  }

  endCount() {
    console.log('end');

  }


  ngOnInit() { }

  RecordAudio() {
    if (this.recordingNow) {
      this.StopRecording(this.file.externalRootDirectory, this.id + '.mp3');
      return;
    }

    this.recordingNow = true;

    this.audioFile = this.media.create(this.file.externalRootDirectory + this.id + '.mp3');
    this.audioFile.startRecord();
    this.status = "Rocording...";
  }

  StopRecording(path, Name) {
    this.audioFile.stopRecord();
    this.status = "Recorded!";

    this.recordingNow = false;

    this.platform.ready()
      .then(() => {
        return this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
      })
      .then((rootDir) => {
        return this.file.getFile(rootDir, this.id + '.mp3', { create: false })
      })
      .then((fileEntry) => {

        fileEntry.file(file => {

          let reader = new FileReader();

          reader.readAsDataURL(file)

          var readedAudio;

          reader.onload = () => readedAudio = reader.result;

          setTimeout(() => {
            this.http.upload(this.list_id, this.id, readedAudio);
          }, 0);

        })
      })


  }

}
