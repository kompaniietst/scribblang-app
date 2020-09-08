import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/core/services/http.service';
import { FileSystemEntity } from 'src/app/core/models/FileSystemEntity';
import { ActivatedRoute } from '@angular/router';
import { LangService } from 'src/app/core/services/lang.service';

@Component({
  selector: 'app-modal-file-system',
  templateUrl: './modal-file-system.component.html',
  styleUrls: ['./modal-file-system.component.scss'],
})
export class ModalFileSystemComponent implements OnInit, AfterViewInit {
  @Input() type: string;
  @Input() path: string[];
  @Input() mode: 'edit' | 'create' = 'create';
  @Input() entity: FileSystemEntity;

  @ViewChild('input') inputToFocus: ElementRef<any>;

  name: string = '';

  constructor(
    public modalController: ModalController,
    private http: HttpService,
    public toastController: ToastController,
    private lang: LangService
  ) { }

  ngOnInit() {
    this.name = this.entity?.name || '';
    this.type = this.entity?.type || this.type;
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputToFocus.nativeElement.setFocus(), 400);
  }

  onFormSubmit(form_value: Partial<FileSystemEntity>) {
    if (this.mode == "create")
      this.createFileSystemEntity(form_value);

    if (this.mode == "edit") {
      this.editFileSystemEntity(form_value.name);

      this.modalController.dismiss();
    }
  }

  createFileSystemEntity(form_value: Partial<FileSystemEntity>) {
    this.http.createFileSystemEntity({
      name: form_value.name, type: this.type, path: this.path
    })
      .then(_ => {
        this.modalController.dismiss();
        this.presentToast(`${this.name} was successfully created.`, 'success')
      });
  }

  editFileSystemEntity(name: string) {
    this.http.editFileSystemEntity(this.entity.id, name)
      .then(_ => {
        this.presentToast(`${this.entity.name} was successfully updated.`, 'success');
      });
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
