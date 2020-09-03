import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LangService } from '../services/lang.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private lang: LangService) {
    // console.log('GUARD');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // this.auth.user$
    //   .subscribe(x => {
    //     console.log('STATTE', x.uid);

    //   })

    //  console.log('RRRRRRR',this.lang.getLang())
 

    return this.auth.guardAuth();
    // return true;
  }

}
