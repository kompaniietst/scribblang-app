import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController, IonItemSliding } from '@ionic/angular';
import { FileSystemEntity } from 'src/app/core/models/FileSystemEntity';
import { ModalFileSystemComponent } from '../modal-file-system/modal-file-system.component';
import { FileSystemProviderService } from 'src/app/core/services/file-system-provider.service';
import { WordsProvideService } from 'src/app/core/services/words-provider.service';

@Component({
  selector: 'app-file-system-view',
  templateUrl: './file-system-view.component.html',
  styleUrls: ['./file-system-view.component.scss'],
})
export class FileSystemViewComponent implements OnInit {

  @Input('children') children = [];
  openedDirectories = [];

  constructor(
    private router: Router,
    private wordService: WordsProvideService,
    public modalController: ModalController,
    public toastController: ToastController,
    private fileService: FileSystemProviderService
  ) { }

  ngOnInit() { }

  toggleEntity(item: FileSystemEntity) {
    if (item.type === 'list')
      this.goToList(item);

    this.isDirectoryOpen(item.id) ? this.close(item.id) : this.open(item.id)
  }

  goToList(item: FileSystemEntity) {
    this.router
      .navigate([`app/tabs/lists/single-list/`],
        { queryParams: { id: item.id, name: item.name } });
  }
  open(id: string) {
    this.openedDirectories.push(id);
  }
  close(id: string) {
    var i = this.openedDirectories.indexOf(id);
    this.openedDirectories.splice(i, 1)
  }
  isDirectoryOpen(id: string) {
    return this.openedDirectories.includes(id);
  }

  onCreateEntityBtn(currEntity_id: string, type: string, path: string[], slidingItem: IonItemSliding) {
    path.push(currEntity_id);
    slidingItem.close();

    if (!this.isDirectoryOpen(currEntity_id))
      this.open(currEntity_id)

    var modalData = {
      props: { type: type, path: path, mode: 'create' },
      class: 'modal-add-system-entity'
    }

    this.presentModal_(modalData);
  }

  async presentModal_(modalData: { props: {}, class: string }) {
    const modal = await this.modalController.create({
      component: ModalFileSystemComponent,
      cssClass: modalData.class,
      componentProps: modalData.props
    });
    return await modal.present();
  }

  editSystemEntity = (entity: FileSystemEntity, slidingItem: IonItemSliding) => {
    var modalData = {
      props: { entity: entity, mode: 'edit' },
      class: 'modal-edit-system-entity'
    }
    this.presentModal_(modalData);
    slidingItem.close();
  }

  removeSystemEntity(id: string, childrenExists: boolean, name: string, type: string, slidingItem: IonItemSliding) {
    slidingItem.close();

    if (childrenExists) {
      this.presentToast('This folder is not empty! Remove files and folders inside at first.', 'danger');
      return;
    }

    if (type === "directory")
      this.fileService.removeFileSystemEntity(id)
        .then(_ => this.presentToast(`${name} was removed`, 'success'))

    if (type === "list")
      this.fileService.removeFileSystemEntity(id)
        .then(() => {
          this.wordService.getWordsBy(id)
            .subscribe(x => {
              console.log('on list rem ', x);
              x.forEach((el: any) => {
                console.log(el.payload.doc.id);
                var word_id = el.payload.doc.id;
                this.wordService.removeWord(id, word_id);
              });
            })
        })
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}