import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./test/test.module').then(m => m.TestPageModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'start',
    loadChildren: () => import('./starter/starter.module').then(m => m.StarterPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'app',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'registration',
    loadChildren: () => import('./auth/registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   redirectTo: '/start',
  //   pathMatch: 'full'
  // },
  {
    path: 'bookmarks',
    loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
