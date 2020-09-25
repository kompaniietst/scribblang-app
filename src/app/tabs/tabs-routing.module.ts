import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'lists',
        loadChildren: () => import('../lists/lists.module').then(m => m.ListsPageModule)
      },
      {
        path: 'bookmarks',
        loadChildren: () => import('../bookmarks/bookmarks.module').then(m => m.BookmarksPageModule)
      },
      {
        path: 'lists/single-list',
        loadChildren: () => import('../single-list/single-list.module').then(m => m.SingleListPageModule)
      },
      {
        path: 'swipe',
        loadChildren: () => import('../swipe/swipe.module').then(m => m.SwipePageModule)
      },
      {
        path: 'game',
        loadChildren: () => import('../game/game.module').then(m => m.GamePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/lists',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/lists',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
