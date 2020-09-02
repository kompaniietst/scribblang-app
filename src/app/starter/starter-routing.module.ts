import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StarterPage } from './starter.page';
import { TabsPage } from '../tabs/tabs.page';

const routes: Routes = [
  {
    path: '',
    component: StarterPage
  },
  // {
  //   path: 'tabs/game',
  //   loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
    
  // }
  // {
  //   path: 'app',
  //   loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StarterPageRoutingModule {}
