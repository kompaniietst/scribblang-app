import { Component, OnInit, Input } from '@angular/core';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import { Md5 } from 'ts-md5';
import { Platform, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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
    public modalController: ModalController,
    private media: Media,
    private file: File,
    private platform: Platform,

    private http: HttpService
  ) { }

  ngOnInit() { }

  RecordAudio() {
    if (this.recordingNow) {
      this.StopRecording();
      return;
    }

    if (!this.file.externalRootDirectory) {
      alert("You can only record audio using the mobile app");
      setTimeout(() => { this.modalController.dismiss(); }, 1000);
      return;
    }


    this.recordingNow = true;

    this.audioFile = this.media.create(this.file.externalRootDirectory + this.id + '.mp3');
    this.audioFile.startRecord();
    this.status = "Recording...";
  }

  StopRecording() {
    this.audioFile.stopRecord();

    this.recordingNow = false;
    this.status = "Done.";

    setTimeout(() => { this.modalController.dismiss(); }, 1000);

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
            this.http.upload(this.list_id, this.id, readedAudio)
              .then(snapshot => console.log('snapshot'))
              .catch(err => alert(err));;
          }, 0);

          //change status
          //close window

        })
      })


  }

}
