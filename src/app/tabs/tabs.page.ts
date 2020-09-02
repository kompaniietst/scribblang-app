import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalWordComponent } from '../components/modal-word/modal-word.component';
import { ModalFileSystemComponent } from '../components/modal-file-system/modal-file-system.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  showCreateWordBtn = false;
  showCreateSystemEntityBtn = false;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public toastController: ToastController
  ) { }

  createWord = () => {
    if (this.currTabIs('single-list'))
      this.presentModalWord();
  }

  async presentModalWord() {
    const modal = await this.modalController.create({
      component: ModalWordComponent,
      cssClass: 'modal-add-word',
      componentProps: { mode: 'create' }
    });
    return await modal.present();
  }

  async presentModalSystemEntity(type: string) {
    console.log('presentModalSystemEntity');

    const modal = await this.modalController.create({
      component: ModalFileSystemComponent,
      cssClass: 'modal-add-system-entity',
      componentProps: { type: type, path: [""] }
    });
    return await modal.present();
  }

  currTabIs = (tabName: string) => {
    return this.router.url.includes(tabName);
  }

  ionTabsDidChange(e) {
    console.log('e', e);
    if (e.tab == "lists")
    this.router.navigate(["app/tabs/lists"]);
  }
}
