import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { Word } from '../core/models/Word';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalController } from '@ionic/angular';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { LangService } from '../core/services/lang.service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  words: Word[] = [];
  openedTranslations: string[] = [];
  allRecords;

  currLang: string;

  ionViewWillEnter() {
    console.log(
      'Enter'
    );
    this.lang.lang$
      .subscribe(lang => {
        if (!!lang) {
          console.log('lang!!!!', lang);

          this.currLang = lang
          // this.words = [
          //     {
          //       id: "pqYUnboC1qjpXasi4uaP",
          //       is_bookmarked: true,
          //       lang: "en",
          //       list_id: "5HNA4UPT9SyocwaJe8NS",
          //       original: "22222222222222222",
          //       transcription: "",
          //       translation: "",
          //       uid: "8qRxvDtQAmZMTtdjHpsIfsx8dkr2"
          //     }
          //   ];

          this.http.getAllBookmarks(lang);

          // this.http.getAllBookmarks(lang).then(x => {
          //   var res = x.docs.map(item => {
          //     return {
          //       id: item.id,
          //       original: item.data()["original"],
          //       translation: item.data()["translation"],
          //       transcription: item.data()["transcription"],
          //       createdAt: item.data()["createdAt"],
          //       list_id: item.data()["list_id"],
          //       is_bookmarked: item.data()["is_bookmarked"],
          //       lang: item.data()["lang"],
          //       uid: item.data()["uid"],
          //     }
          //   })
          //   console.log('BOOKwords ', res);
          //   this.words = res;
          //   // this.WS = this.words;
          //   // this.WSS.next([...this.WS]);
          // })
        }
      })


  }

  ionViewDidLoad() {
    console.log("I'm alive!");
  }
  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
  }

  private WSS: BehaviorSubject<Word[]> = new BehaviorSubject([]);
  WS = [];
  W = this.WSS.asObservable();




  constructor(
    private http: HttpService,
    private lang: LangService,

    private modalController: ModalController,
  ) {


    this.http.bookm$
      .subscribe(x => {
        console.log('bookm$ ', x);
        this.words = x
      })
    // console.log('LLL ', this.lang.get());


    // this.http.getAllBookmarks('en').onSnapshot(x => {
    //   this.words = x.docs.map(item => {
    //     return {
    //       id: item.id,
    //       original: item.data()["original"],
    //       translation: item.data()["translation"],
    //       transcription: item.data()["transcription"],
    //       createdAt: item.data()["createdAt"],
    //       list_id: item.data()["list_id"],
    //       is_bookmarked: item.data()["is_bookmarked"],
    //       lang: item.data()["lang"],
    //       uid: item.data()["uid"],
    //     }
    //   })
    //   console.log('BOOKwords ', this.words);

    //   // this.WS = this.words;
    //   // this.WSS.next([...this.WS]);
    // })


    // setTimeout(() => {
    //   this.words = [
    //     {
    //       id: "pqYUnboC1qjpXasi4uaP",
    //       is_bookmarked: true,
    //       lang: "en",
    //       list_id: "5HNA4UPT9SyocwaJe8NS",
    //       original: "22222222222222222",
    //       transcription: "",
    //       translation: "",
    //       uid: "8qRxvDtQAmZMTtdjHpsIfsx8dkr2"
    //     }
    //   ];
    // }, 2000);


    this.W.subscribe(x => {
      console.log('W', x)
    })



    console.log(' ');
    console.log('   BOOKMARKS    ');
    console.log(' ');

    // this.lang.lang$
    //   .subscribe((lang: string) => this.currLang = lang);

    /*     this.lang.lang$
          .subscribe(lang => {
            if (!!lang) {
    
              this.currLang = lang
    
              this.http.getAllBookmarks(lang).onSnapshot(x => {
                this.words = x.docs.map(item => {
                  return {
                    id: item.id,
                    original: item.data()["original"],
                    translation: item.data()["translation"],
                    transcription: item.data()["transcription"],
                    createdAt: item.data()["createdAt"],
                    list_id: item.data()["list_id"],
                    is_bookmarked: item.data()["is_bookmarked"],
                    lang: item.data()["lang"],
                    uid: item.data()["uid"],
                  }
                })
                console.log('BOOKwords ', this.words);
    
                this.WS = this.words;
                this.WSS.next([...this.WS]);
              })
            }
          }) */


  }



  ngOnInit() { }

  toggleTranslation = (id: string) => {
    this.openedTranslations.includes(id)
      ? this.closeTranslation(id)
      : this.openTranslation(id)
  }

  openTranslation(id: string) {
    this.openedTranslations.push(id);
  }

  closeTranslation(id: string) {
    var i = this.openedTranslations.indexOf(id);
    console.log(i);

    this.openedTranslations.splice(i, 1);
  }

  isTranslationOpened(id: string) {
    return this.openedTranslations.includes(id);
  }

  // playRecorded = (id: string, list_id: string) => {
  //   // this.http.getSingeRecord(list_id, id)
  //   //   .then(x => {
  //   //     alert('firebase => ' + JSON.stringify(x))
  //   //   }).catch(x => {
  //   //     alert('err ' + JSON.stringify(x));
  //   //   });

  //   // this.http.getAllRecords(list_id)
  //   //   .then(x => {
  //   //     alert('recs ' + JSON.stringify(x));

  //   //     this.allRecords = x.items.map(x => x.toString());
  //   //   }).catch(x => {
  //   //     alert('err' + JSON.stringify(x));
  //   //   });

  //   this.http.getSingeRecord(list_id, id)
  //     .then(x => {
  //       console.log('recsSSS ', x);

  //       var url = x.items.map(x => x.toString()).find(x => x.includes(id));
  //       console.log(url);

  //       if (url) this.http.play(list_id, id);

  //     }).catch(x => {
  //       console.log(x);
  //     });
  // }


  // async ifRecordExist(list_id, id) {
  //   try {
  //     const x = await this.http.getSingeRecord(list_id, id);
  //     console.log('recsSSS ', x);

  //     var url = x.items.map(x_1 => x_1.toString()).find(x_2 => x_2.includes(id));
  //     console.log(url);

  //     if (url)
  //       return true;
  //     else
  //       return false;
  //   }
  //   catch (x_3) {
  //     console.log(x_3);
  //   }
  // }






  unBookmark(id: string) {
    this.http.unBookmark(id);
  }

  edit = async (word: Word) => {
    const modal = await this.modalController.create({
      component: ModalWordComponent,
      cssClass: "modal-edit-word",
      componentProps: { word: word, mode: 'edit' }
    });
    return await modal.present();
  }
  //   this.presentModal(
  //     { word: word, mode: 'edit' }, "modal-edit-word", ModalWordComponent);


  // async presentModal(prop: {}, className: string, component) {

  // }



  shuffle() {
    this.words = this.words.sort(() => Math.random() - 0.5)
  }
}