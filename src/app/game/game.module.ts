import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamePage } from './game.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { GamePageRoutingModule } from './game-routing.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    GamePageRoutingModule,

    ComponentsModule
  ],
  declarations: [GamePage]
})
export class GamePageModule {}
