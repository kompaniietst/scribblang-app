import { Component } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { FileSystemEntity } from '../core/models/FileSystemEntity';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LangService } from '../core/services/lang.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage {

  treeData: FileSystemEntity[];
  isEmpty: boolean = false;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private lang: LangService,
    private storage: Storage
  ) {

    this.lang.lang$
      .subscribe((x) => {
        console.log(x);
        this.getFilesStructure()
      })
  }

  getFilesStructure() {
    this.http.getFileSystemEntities()
      .onSnapshot(querySnapshot => {

        var data = querySnapshot.docs.map(item => {
          return {
            id: item.id,
            name: item.data()["name"],
            path: item.data()["path"],
            type: item.data()["type"],
            lang: item.data()["lang"],
            uid: item.data()["uid"],
            createdAt: item.data()["createdAt"],
          }
        });
        this.isEmpty = data.length === 0;
        console.log(`Received`, data);

        this.treeData = [];
        this.buildTree(data, this.treeData, "");
      }, err => {
        console.log(`Error: ${err}`);
      });
  }

  buildTree(data: FileSystemEntity[], parentJson: FileSystemEntity[], path: string) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].path.join("") == path) {

        var systemEntity = new FileSystemEntity(
          data[i].id,
          data[i].name,
          data[i].path,
          data[i].createdAt,
          data[i].type,
          [])

        parentJson.push(systemEntity)
        this.buildTree(data, systemEntity.children, path + data[i].id)
      }
    }

  }
}