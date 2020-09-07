import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from '../core/pipes/capitalize.pipe';
import { HeaderComponent } from './header/header.component';
import { FileSystemViewComponent } from './file-system-view/file-system-view.component';
import { ModalWordComponent } from './modal-word/modal-word.component';
import { ModalFileSystemComponent } from './modal-file-system/modal-file-system.component';
import { ModalAudioComponent } from './modal-audio/modal-audio.component';
import { SingleBookmarkComponent } from './single-bookmark/single-bookmark.component';
import { SingleWordItemComponent } from './single-word-item/single-word-item.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FileSystemViewComponent,
    CapitalizePipe,
    ModalWordComponent,
    ModalFileSystemComponent,
    ModalAudioComponent,
    SingleBookmarkComponent,
    SingleWordItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
    FileSystemViewComponent,
    SingleBookmarkComponent,
    SingleWordItemComponent
  ],
  providers: []
})
export class ComponentsModule { }
