import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleListPage } from './single-list.page';
import { SingleListRoutingModule } from './single-list-routing.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SingleListRoutingModule,
    ComponentsModule
  ],
  declarations: [SingleListPage]
})
export class SingleListPageModule {}