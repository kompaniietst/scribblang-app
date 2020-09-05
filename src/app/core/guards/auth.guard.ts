import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LangService } from '../services/lang.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
    private lang: LangService,
    private router: Router,
    private storage: Storage
  ) {
    // console.log('GUARD');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.isLoggedIn()) {
      console.log(('this.auth.isLoggedIn()').toUpperCase());
      return true;
    }

    if (!this.auth.isLoggedIn()) {
      console.log('YOU CAN _NOT_ ENTER');

      this.router.navigate(['login']);
      return false;
    }
  }
}
