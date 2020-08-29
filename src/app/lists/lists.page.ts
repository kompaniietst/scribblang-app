import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HttpService } from '../core/services/http.service';
import { FileSystemEntity } from '../core/models/FileSystemEntity';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage {

  constructor(
    private http: HttpService
  ) { }

  treeData: FileSystemEntity[];

  ngOnInit(): void {
    this.http.getFileSystemEntities()
      .subscribe(res => {

        var data = res.map((item: any) => {
          return {
            id: item.payload.doc.id,
            name: item.payload.doc.data()["name"],
            path: item.payload.doc.data()["path"],
            type: item.payload.doc.data()["type"],
            createdAt: item.payload.doc.data()["createdAt"],
          }
        })

        this.treeData = [];
        this.buildTree(data, this.treeData, "");
      })
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