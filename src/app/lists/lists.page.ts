import { Component } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { FileSystemEntity } from '../core/models/FileSystemEntity';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LangService } from '../core/services/lang.service';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage {

  currLang: string;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private lang: LangService
  ) {
    console.log(' ');

    this.lang.lang$
      // .pipe(tap(x => { console.log('LIST', x); }))
      .subscribe((lang: string) => this.getFilesStructure(lang));
  }

  treeData: FileSystemEntity[];

  ngOnInit(): void { }

  getFilesStructure(lang: string) {
    this.http.getFileSystemEntities(lang)
      .onSnapshot(querySnapshot => {

        var data = querySnapshot.docs.map(item => {
          return {
            id: item.id,
            name: item.data()["name"],
            path: item.data()["path"],
            type: item.data()["type"],
            lang: item.data()["lang"],
            createdAt: item.data()["createdAt"],
          }
        });

        console.log(`Received`, data);

        this.treeData = [];
        this.buildTree(data, this.treeData, "");
      }, err => {
        console.log(`Encountered error: ${err}`);
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