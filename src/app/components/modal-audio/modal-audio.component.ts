import { Component, OnInit, Input } from '@angular/core';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File, Entry } from "@ionic-native/file/ngx";
import { Md5 } from 'ts-md5';
import { Platform } from '@ionic/angular';
import * as firebase from "firebase";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
// import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media';

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
    // private streamingMedia: StreamingMedia
  ) { }

  ngOnInit() {
    console.log('id', this.route.snapshot.queryParams.id);


    // var player = new Audio();
    // player.setAudioStreamType(AudioManager.STREAM_MUSIC);
/* 
    var ref = firebase.storage().ref().child(this.list_id + '/' + 'qHULZvL4zNzegoGGJJf0.mp3');
    ref.getDownloadURL()
      .then(url => {
        alert(url);

        // let options: StreamingAudioOptions = {
        //   bgColor: 'red',
        //   successCallback: () => { console.log('Audio played') },
        //   errorCallback: (e) => { console.log('Error streaming') }
        // };

        // this.streamingMedia.playAudio(url);

      }) */
  }

  RecordAudio() {
    console.log(this.recordingNow);

    if (this.recordingNow) {
      this.StopRecording(this.file.externalRootDirectory, this.id + '.mp3');
      return;
    }

    this.recordingNow = true;

    this.audioFile = this.media.create(this.file.externalRootDirectory + this.id + '.mp3');



    this.audioFile.startRecord();
    this.status = "Rocording...";

    this.status = "Rocording...";
  }

  StopRecording(path, Name) {
    this.audioFile.stopRecord();
    this.status = "Recorded!";

    console.log(this.audioFile);



    this.recordingNow = false;


    console.log(this.recordingNow);
    let storageRef = firebase.storage().ref().child(this.list_id + '/' + this.id + '.mp3');

    this.platform.ready()
      .then(() => {
        return this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
      })
      .then((rootDir) => {
        // alert(2);
        alert(rootDir.name);
        // alert(rootDir.fullPath);
        return this.file.getFile(rootDir, this.id + '.mp3', { create: false })
      })
      .then((fileEntry) => {
        // alert('fileEntry.nativeURL');
        // alert(fileEntry.nativeURL);
        // alert(fileEntry.name);
        // alert(fileEntry.isFile);
        // alert(fileEntry.fullPath);



        fileEntry.file(file => {

          alert(JSON.stringify(file));


          let reader = new FileReader();

          reader.readAsDataURL(file)


          reader.onload = function () {
            alert(reader.result);

            storageRef.putString(reader.result as string, 'data_url').then(function (snapshot) {
              alert('Uploaded a base64 string!');
            }).catch(err => alert(err));
          };

        })
      })


  }

}
