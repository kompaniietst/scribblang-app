import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, from, ReplaySubject } from 'rxjs';
import { switchMap, map, flatMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // private user: Observable<firebase.User>;
  private user: firebase.User = null;

  /*  */
  public userSubject: ReplaySubject<firebase.User> = new ReplaySubject(1);
  user$ = this.userSubject.asObservable();

  currUserId;



  private currUserSubj = new BehaviorSubject(JSON.parse(localStorage.getItem("currUser")) || {});
  currUser = this.currUserSubj.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: Storage
  ) {
    /* 
        // storage.set('lang', 'lang');
        storage.get('lang').then((lang) => {
          console.log('..............Your lang is', lang, lang === null);
          if (lang === null) {
            // alert()
            this.router.navigate(["app/tabs/game"]);
            // this.router.navigate(["start"]);
          }
    
        });; */

    this.afAuth.authState
      .subscribe(
        (user) => {
          console.log('AuthState ', user);

          this.storage.get('lang').then((val) => {
            console.log('..............Your age is', val, val === null);
            if (val === null) {
              // alert()
              this.router.navigate(["start"]);
              // this.router.navigate(["start"]);
            }
            else
              this.router.navigate(['app/tabs/lists'])

          });;


          // this.router.navigate(['app/tabs/lists'])

          // this.router.navigate(['start'])
          if (user) {
            this.user = user;
          }
        }
      );


    this.afAuth.onAuthStateChanged(authData => {

      if (authData != null) {
        console.log('authData', authData.uid);
        this.userSubject.next(authData);
        this.currUserId = authData.uid;

        // if(authData){
        //   authData.
        //   authData.updateProfile({
        //      displayName: 'DN',
        //      LANG:'lang',
        //      photoURL: "PU"
        //   }).then(
        //     (s)=> console.log('updated')
        //   )
        // }

      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  isLoggedIn() {
    return !!this.user
    // return false;
    // return true;
  }

  getCurrUser() {
    return this.user;
  }

  doRegister(user) {
    // console.log('doRegister ', user);

    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          resolve(res);

          this.addUsertoColection(res.user)
        }, err => reject(err))
    })
  }

  doSignIn(user) {
    // console.log('doSignIn ', user);

    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // console.log('res', res);

          var user = {
            uid: res.user.uid,
            email: res.user.email
          }

          localStorage.setItem('currUser', JSON.stringify(user))
          this.currUserSubj.next(user);


          resolve(res);
        }, err => reject(err))
        .catch(err => console.log(err))
    })
  }


  logout() {
    this.afAuth.signOut()
      .then((res) => {
        this.user = null;
        // this.storage.remove('lang');
        console.log('Logout', res);
        this.router.navigate(['login'])
      })

    localStorage.removeItem("currUser");

    this.currUserSubj.next(null);
  }


  getCurrUserUid = () => {
    // console.log('currUserId', this.currUserId);

    return this.currUserId;
  }




  addUsertoColection(user) {
    // console.log('aft reg', user);

    this.firestore.collection('users')
      .doc(user.uid)
      .set({
        uid: user.uid,
        email: user.email,
      })
      .then(x => console.log('New user added to collection', x))
      .catch(error => {
        console.log('Something went wrong with added user to firestore: ', error);
      })
  }

  // async auth(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.userSubject.subscribe((authData) => {
  //       resolve(authData.uid);
  //     }, (error => {
  //       reject(error);
  //     }));
  //   });
  // }

  // guardAuth() {
  //   return from(this.auth().then(result => {
  //     return true;
  //   }).catch(error => {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }));
  // }

  // setLangtoUser(uid: string, lang: string) {
  //   this.firestore.collection("users")
  //     .doc(uid)
  //     .set({ lang: lang }, { merge: true })
  //     .then(x => console.log('add lang', x));
  // }
}
