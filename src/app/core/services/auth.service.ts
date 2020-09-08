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

  private user: firebase.User = null;

  public userSubject: ReplaySubject<firebase.User> = new ReplaySubject(1);
  user$ = this.userSubject.asObservable();


  private currUserSubj = new BehaviorSubject(JSON.parse(localStorage.getItem("currUser")) || {});
  currUser = this.currUserSubj.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: Storage
  ) {

    this.afAuth.authState
      .subscribe(
        (user) => {

          this.storage.get('lang').then((val) => {
            if (val === null) {
              this.router.navigate(["start"]);
            }
            else {
              this.userSubject.next(user);
              this.router.navigate(['app/tabs/lists'])
            }
          });

          if (user) {
            this.user = user;
          }
        }
      );


    this.afAuth.onAuthStateChanged(authData => {
      if (authData != null) {
        this.userSubject.next(authData);
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  isLoggedIn = () => !!this.user

  getCurrUser = () => this.user;

  doRegister(user) {

    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          resolve(res);

          this.addUsertoColection(res.user)
        }, err => reject(err))
    })
  }

  doSignIn(user) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {

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
        console.log('Logout', res);
        this.router.navigate(['login'])
      })

    localStorage.removeItem("currUser");

    this.currUserSubj.next(null);
  }

  addUsertoColection(user) {
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

}
