import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
