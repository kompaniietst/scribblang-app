import { Component } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { FileSystemEntity } from '../core/models/FileSystemEntity';
import { ActivatedRoute } from '@angular/router';
import { LangService } from '../core/services/lang.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss']
})
export class ListsPage {

  currLang: string;
  name="dddDDDD"
  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private lang: LangService
  ) {
    console.log(' ');

    this.lang.lang$
      .pipe(tap(x => {
        console.log(' ');
        console.log('LIST', x);
        console.log(' ');
      }
      ))
      .subscribe((lang: string) => this.getFilesStructure(lang));
  }

  treeData: FileSystemEntity[];

  ngOnInit(): void {
    console.log('ON INIT');

    /*     this.http.getFileSystemEntities(this.currLang)
          .onSnapshot(querySnapshot => {
    
            console.log('querySnapshot', querySnapshot);
    
    
            var data = querySnapshot.docs.map(item => {
              // console.log('d', item.data());
    
              return {
                id: item.id,
                name: item.data()["name"],
                path: item.data()["path"],
                type: item.data()["type"],
                lang: item.data()["lang"],
                createdAt: item.data()["createdAt"],
              }
    
    
            });
    
            // var data = querySnapshot.docChanges().map(item => {
    
            //   return {
            //     id: item.doc.id,
            //     name: item.doc.data()["name"],
            //     path: item.doc.data()["path"],
            //     type: item.doc.data()["type"],
            //     createdAt: item.doc.data()["createdAt"],
            //   }
    
            // });
            console.log(`Received`, data);
    
            this.treeData = [];
            this.buildTree(data, this.treeData, "");
    
            // var data = querySnapshot.map((item: any) => {
            //   return {
            //     id: item.payload.doc.id,
            //     name: item.payload.doc.data()["name"],
            //     path: item.payload.doc.data()["path"],
            //     type: item.payload.doc.data()["type"],
            //     createdAt: item.payload.doc.data()["createdAt"],
            //   }
            // })
    
    
    
          }, err => {
            console.log(`Encountered error: ${err}`);
          }); */


    // .subscribe(res => {

    //   var data = res.map((item: any) => {
    //     return {
    //       id: item.payload.doc.id,
    //       name: item.payload.doc.data()["name"],
    //       path: item.payload.doc.data()["path"],
    //       type: item.payload.doc.data()["type"],
    //       createdAt: item.payload.doc.data()["createdAt"],
    //     }
    //   })

    //   this.treeData = [];
    //   this.buildTree(data, this.treeData, "");
    // })
  }

  getFilesStructure(lang: string) {
    this.http.getFileSystemEntities(lang)
      .onSnapshot(querySnapshot => {

        console.log('querySnapshot', querySnapshot);

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