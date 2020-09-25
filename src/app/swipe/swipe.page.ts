import { Component, OnInit } from '@angular/core';
import { FileSystemProviderService } from '../core/services/file-system-provider.service';
import { SystemEntity } from '../core/models/SystemEntity';
import { Word } from '../core/models/Word';
import { WordsProvideService } from '../core/services/words-provider.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.page.html',
  styleUrls: ['./swipe.page.scss'],
})
export class SwipePage implements OnInit {

  lists: Partial<SystemEntity>[];
  selectedLists: Partial<SystemEntity>[] = [];
  startGame: boolean = false;
  words: Word[] = [];
  wordsToShow: Word[] = [];
  word: Word;
  showTranslate: boolean = false;

  constructor(
    private fileService: FileSystemProviderService,
    private wordsService: WordsProvideService
  ) {
    this.fileService.getFileSystemEntities()
      .onSnapshot(querySnapshot => {

        var data = querySnapshot.docs.map(item => {
          return {
            id: item.id,
            name: item.data()["name"],
          }
        });

        this.lists = data;
        console.log(`Received`, data);


      }, err => {
        console.log(`Encountered error: ${err}`);
      });
  }

  ngOnInit() {
  }

  selectList(checked: boolean, list: Partial<SystemEntity>) {
    console.log(checked, list);

    if (!checked) {
      var i = this.selectedLists.findIndex(x => x.id === list.id);
      console.log(this.selectedLists);

      this.selectedLists.splice(i, 1);
    }

    if (checked)
      this.selectedLists.push(list);
  }

  start() {
    let lists_ids = this.selectedLists.map(l => l.id);
    this.wordsService.getWordsByLists(lists_ids)
      .then(x =>
        x.docs.forEach(el => {
          let word = el.data();
          word["rating"] = 0;

          this.words.push(word);
        }))
      .then(_ => {
        console.log('WORDS', this.words);

        this.startGame = true;
        this.showWord();
      })
  }

  showWord = () => {
    this.word = this.getRandomWord();
    this.showTranslate = false;
  }

  getRandomWord() {

    if (this.wordsToShow.length === 0)
      this.wordsToShow = [...this.words];

    console.log('----------------------');

    console.log(this.wordsToShow);

    let rand = this.wordsToShow[Math.floor(Math.random() * this.wordsToShow.length)];
    rand["rating"]++;

    var i = this.wordsToShow.findIndex(x => x.id === rand.id);
    console.log(i);

    this.wordsToShow.splice(i, 1);

    console.log(this.wordsToShow);



    return rand;
  }

}
