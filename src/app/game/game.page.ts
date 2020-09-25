import { Component } from '@angular/core';
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss']
})
export class GamePage {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToSwipe() {
    this.router.navigate(["app/tabs/swipe/"]);
  }
}