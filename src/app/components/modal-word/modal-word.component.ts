import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { HttpService } from 'src/app/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/core/models/Word';
import { NgForm } from '@angular/forms';

import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File, Entry } from "@ionic-native/file/ngx";

import { Md5 } from 'ts-md5/dist/md5';

import { FileEntry } from '@ionic-native/file';


import * as firebase from "firebase";

import { base64ToFile } from 'ngx-image-cropper';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


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

  // private audioFile_: any

  constructor(
    public modalController: ModalController,
    private http: HttpService,
    private route: ActivatedRoute,
    public toastController: ToastController,

    private media: Media, private file: File

    , private platform: Platform,


    private str: AngularFireStorage,


  ) {
    // alert('begin');
    // platform.ready()
    //   .then(() => {
    //     return this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
    //   })
    //   .then((rootDir) => {
    //     return this.file.getFile(rootDir, 'md5_id.mp3', { create: false })
    //   })
    //   .then((fileEntry) => {
    //     fileEntry.file(file => {
    //       alert(file.name);
    //       this.http.upload(file, file.name)
    //       console.log(file)
    //     })
    //   })

  }

  @ViewChild('f') f: ElementRef<any>;

  ngOnInit(): void {
    this.original = this.word?.original || '';
    this.translation = this.word?.translation || '';
    this.transcription = this.word?.transcription || '';
  }
  changefile(e) {

    console.log(e.target.files[0]);
    this.http.upload(e.target.files[0], e.target.files[0].name)
  }
  ngAfterViewInit() {
    console.log(this.f.nativeElement.files);


    setTimeout(() => this.inputToFocus.nativeElement.setFocus(), 400);
  }

  onFormSubmit(form: NgForm, form_value: Partial<Word>) {
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

  recordingNow: boolean = false;
  blob;

  RecordAudio() {
    if (this.recordingNow) {
      this.StopRecording(this.file.externalRootDirectory, 'mp.mp3');
      return;
    }

    var md5_id = this.md5.appendStr(this.original + this.transcription + this.transcription + new Date()).end();
    console.log(this.original, this.transcription, this.transcription, new Date());
    console.log(md5_id);

    this.audioFile = this.media.create(this.file.externalRootDirectory + 'mp.mp3');
    // this.audioFile = this.media.create('./assets' + `md5_id.mp3`);

    //  var audioBlob = new Blob([this.audioFile as BlobPart], {type: 'audio/mp3'}); 

    this.recordingNow = true;

    // this.file.createFile('./assets', 'md5_id.mp3', true)

    // this.file.createFile(this.file.externalRootDirectory, 'mp3.txt', true)
    // this.blob = new Blob([this.audioFile_ as BlobPart], { type: "audio/mp3" });
    // this.audioFile = this.media.create(this.file.externalRootDirectory + `/ ${ md5_id }.mp3`);


    // console.log('f', this.file);

    // alert(this.file.externalRootDirectory);





    // this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
    //   .then((directoryEntry: any) => {
    //     alert(directoryEntry);
    //     this.file.getFile(directoryEntry, 'myFile.txt', { create: false })
    //       .then((fileEntry: FileEntry) => {
    //         alert('ddd');
    //         alert(fileEntry);

    //       });
    //   });



    //   this.file.resolveDirectoryUrl(this.file.externalRootDirectory);

    //     .then((rootDir) => {
    //   return this.file.getFile(rootDir, 'mp3.txt', { create: false })
    // })

    // .then((fileEntry: DirectoryEntry) => {
    //   fileEntry.file(file => {
    //     console.log('FFFILEE', file)
    //     alert(file)
    //   })
    // })




    // this.audioFile_.createFile(path, name, true);


    this.audioFile.startRecord();
    this.status = "Rocording...";

    this.md5.appendStr('somestring');

    // Generate the MD5 hex string
    this.md5.end();

    this.status = "Rocording...";
  }

  StopRecording(path, Name) {
    this.audioFile.stopRecord();
    this.status = "Recorded!";

    console.log(this.audioFile);

    // new Blob([this.audioFile], {type: 'audio/mp3'})

    // this.getBlobFromFileEntry(this.blob);


    this.recordingNow = false;

    // var fileName = 'md5_id.mp3';
    // var base64File;
    // alert(Name);

    // const file = base64ToFile(img); 

    // let storageRef2 = this.str;

    // storageRef2.upload(path, file, { contentType: 'image/png'})

    /*     let storageRef = firebase.storage().ref().child('117.png');
        var img = `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ARAXwKnymn9ZASjFVcFnXhjNAEi0EhwEjL0ykgGQ6o8yJ//HeO2LDIBkDwLyvz/8Jx9mAATeA/z8ZgZA5NMA750DIPIrwPjbGQAJl/s1Ice+BSDl7sr7AU5kAKTcjJy3PzIAQNLlfX/QY6MAJF19ztv/NAMg6XK+Kmh4AIDQAI6OA5B01TmfCT6dAZB0hZy3PwhA6IOAaxcBCA1gcAyAtKuxBwAgx74CIDaAywDEPgq4AEDq5wHy3fwlAGID+A6AxMv35hDj1wAI3WgGQOhGAIjdGACx+xGA2P0EgEUgANYAANgFACAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAGg1AHsnno7t7Yg1++17em8tvz1+2EBPHTn/+cXpa0try2fjAtA1gACQAAIAAEgAASAABAAAiBK1wEQAAJAAAgAASAABIAAEAACoNxzKlgACAABIAAEgAAQAAJAAAgAAVDe+VuAABAAAkAACAABIAAEgAAQAGWfU8ECQAAIAAEgAASAABAAAkAAlH1OBQsAASAABIAAEAACQAAIAAEgAMo7fwsQAAJAAAgAASAABIAAEAACoOxzKlgACAABIAAEgAAQAAJAAKisAbwx9XZubVFPnt/rZ0fz2vI3cQF8cFu3tjVXABff8QogAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAA8BQAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEAACeAgAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAB0E/0CSGzGJYfAmG4AAAAASUVORK5CYII=`
        storageRef.putString(img).then(function (snapshot) {
          alert('Uploaded a base64 string!');
        }).catch(err => alert(err)); */


    let storageRef = firebase.storage().ref().child('mp.mp3');

    this.platform.ready()
      .then(() => {
        return this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
      })
      .then((rootDir) => {
        alert(2);
        alert(rootDir.name);
        alert(rootDir.fullPath);
        return this.file.getFile(rootDir, 'mp.mp3', { create: false })
      })
      .then((fileEntry) => {
        alert('fileEntry.nativeURL');
        alert(fileEntry.nativeURL);
        alert(fileEntry.name);
        alert(fileEntry.isFile);
        alert(fileEntry.fullPath);

        // storageRef.put(fileEntry).then(function (snapshot) {
        //   alert('Uploaded a base64 string!');
        // }).catch(err => alert(err));


        fileEntry.file(file => {
          // alert(file.name);
          // alert(file);
          // alert(file.type);
          alert(JSON.stringify(file));


          let reader = new FileReader();
          // reader.onloadend = function (e) {
          //   this.teste3 = this.result
          // }
          reader.readAsDataURL(file)

          // reader.readAsText(file);

          reader.onload = function() {
            alert(reader.result);

            storageRef.putString(reader.result as string, 'data_url').then(function (snapshot) {
              alert('Uploaded a base64 string!');
            }).catch(err => alert(err));
          };


          // const buffer = this.file.readAsArrayBuffer('/', file.name);
          // const fileBlob = new Blob([buffer as BlobPart], type);

          // file.arrayBuffer().then(x => alert('buf'))
          // this.http.upload(file, file.name)
          // console.log(file)
          
      /*     var s = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';

          storageRef.putString(s, 'data_url').then(function (snapshot) {
            alert('Uploaded a base64 string!');
          }).catch(err => alert(err));
 */
        })
      })


    //     var img = `data: image / png; base64,
    //  iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGP
    //  C/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YGARc5KB0XV+IA
    //  AAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAF1J
    //  REFUGNO9zL0NglAAxPEfdLTs4BZM4DIO4C7OwQg2JoQ9LE1exdlYvBBeZ7jq
    //  ch9//q1uH4TLzw4d6+ErXMMcXuHWxId3KOETnnXXV6MJpcq2MLaI97CER3N0
    //  vr4MkhoXe0rZigAAAABJRU5ErkJggg==`;


    //     storageRef.putString(img).then(function (snapshot) {
    //       // storageRef.putString(file, "base64", {contentType: "audio/mpeg"}).then(function (snapshot) {
    //       alert('Uploaded a base64 string!');
    //     }).catch(err => alert(err));



    // let metadata = {
    //   contentType: 'audio/mp3',
    // };
    // let filePath = `${this.file.externalRootDirectory}` + `${fileName}`;

    // alert(fileName);
    // alert(this.file.externalRootDirectory);

    this.file.readAsDataURL(this.file.externalRootDirectory, Name).then((file) => {

      // base64File = file;
      // alert('get file');
      /*  alert(file); */

      // storageRef.putString('5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB', 'base64').then(function (snapshot) {
      // storageRef.putString(file, "base64", {contentType: "audio/mpeg"}).then(function (snapshot) {

      /*       var img = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgEpAgAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpj...iigCvdrtDYJ/OsS8G480UUAc3fjBNZbUUUAafhnQLXXtTEN1v2AfwHBNYusaZDY3ssUW7YrYGTnjNFFAGYfu1EetFFAEkXWpT0/GiigBpOQaQngUUUABPWgHNFFADSTmlxmiigBDwKjl6CiigBiVKODRRQA8dKDRRQAh6Umc0UUAC0p7UUUALQelFFABRRRQAgPFJ/hRRQAZNHWiigAXrRk0UUAGeM96SiigAooooAa3ekXmiigBacOlFFADT1pr0UUANQ1MOlFFAAe1NPWiigAoBoooAXsaQ9aKKAGtTF60UUAS0UUUAFNPeiigBB1px6UUUANooooAcORSHrRRQAlFFFABRRRQAUUUUAFFFFABSNRRQA2iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==';
      
            storageRef.putString(img).then(function (snapshot) {
              alert('Uploaded a base64 string!');
            }).catch(err => alert(err)); */


      // let voiceRef = storageRef.child(`voices/${fileName}`).putString(file, firebase.storage.StringFormat.BASE64);

      // voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      //   console.log("uploading");
      // }, (e) => {
      //   // reject(e);
      //   console.log(JSON.stringify(e, null, 2));
      // }, () => {
      //   var downloadURL = voiceRef.snapshot.downloadURL;
      //   // resolve(downloadURL);
      // });
    });




    // this.upl(name);

    /* 
    
        this.file.resolveDirectoryUrl(path) // as well tested with "/www/assets/data" and "/www/assets/data/", with or without the front "/", as well with all those solutions with `this.file.applicationDirectory +` in front of the string
          .then(directoryEntry => {
            alert(directoryEntry);
            
            directoryEntry.createReader().readEntries(function (entries: Entry[]) {
              for (let entry of entries) {
                console.log(entry);
                // alert(2);
                if (entry.name == 'md5_id.mp3') {
                  alert(entry.fullPath );
                  alert(entry.isFile );
                  alert(entry.nativeURL );
    
                  this.makeFileIntoBlob(entry.nativeURL)
    
    
                  // const blob = new Blob([entry],{type: 'audio/mp3'})
    
                  // let metadata = {
                  //   contentType: 'audio/mp3',
                  // };
              
                  // firebase.storage().ref().child(name)
                  //   .put(blob).then(function (snapshot) {
                  //     console.log(snapshot);
              
                  //     alert('Uploaded a blob or file!');
                  //   });
    
    
    
                  // this.http.upload(entry, name);
                }
              }
            })
          }); */
  }


  makeFileIntoBlob(_filePath) {
    alert('_filePath');
    alert(_filePath);
    // return new Promise((resolve, reject) => {
    //     let fileName, fileExtension = "";
    //     this.file.resolveLocalFilesystemUrl(_filePath)
    //         .then(fileEntry => {
    //             let {name, nativeURL} = fileEntry;
    //             // get the path..
    //             let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
    //             fileName = name;
    //             // if you already know the file extension, just assign it to           // variable below
    //             fileExtension = fileName.match(/\.[A-z0-9]+$/i)[0].slice(1);
    //             // we are provided the name, so now read the file into a buffer
    //             return this.file.readAsArrayBuffer(path, name);
    //         })
    //         .then(buffer => {
    //             // get the buffer and make a blob to be saved
    //             let medBlob = new Blob([buffer], {
    //                 type: `audio/${fileExtension}`
    //             });

    //             // pass back blob and the name of the file for saving
    //             // into fire base
    //             resolve({ blob: medBlob, blobName: name});
    //         })
    //         .catch(e => reject(e));
    // });
  }


  getBlobFromFileEntry(fileEntry: any) {
    console.log('fileEntry', fileEntry);

    // return new Promise((resolve, reject) => {
    //   fileEntry.file((file) => {
    //     const reader = new FileReader();
    //     reader.onloadend = function (e) {
    //       try {
    //         const { result: buffer } = e.target
    //         const blob = new Blob(
    //           [new Uint8Array(buffer as any)],
    //           { type: file.type }
    //         );
    //         resolve(blob);
    //       } catch (error) {
    //         reject(error);
    //       }
    //     };
    //     reader.onabort = (ev) => reject(ev);
    //     reader.onerror = (ev) => reject(ev);
    //     reader.readAsArrayBuffer(file);
    //   }, (err) => {
    //     reject(err);
    //   })
    // })


  }


  upl(name) {
    this.http.upload(this.blob, name);
  }

  public press: number = 0;
  pressEvent() {
    this.press++;

  }
}