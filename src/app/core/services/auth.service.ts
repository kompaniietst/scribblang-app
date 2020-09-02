import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, from, ReplaySubject } from 'rxjs';
import { switchMap, map, flatMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSubject: ReplaySubject<firebase.User> = new ReplaySubject(1);
  user$ = this.userSubject.asObservable();

  currUserId;

  private currUserSubj = new BehaviorSubject(JSON.parse(localStorage.getItem("currUser")) || {});
  currUser = this.currUserSubj.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.afAuth.onAuthStateChanged(authData => {
      console.log('authData', authData);

      if (authData != null) {
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
  user(user: any) {
    throw new Error("Method not implemented.");
  }

  logout() {
    this.afAuth.signOut();
    localStorage.removeItem("currUser");
    this.router.navigate(['login']);

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
      .then(x => console.log('ad to col', x));
  }

  async auth(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userSubject.subscribe((authData) => {
        resolve(authData.uid);
      }, (error => {
        reject(error);
      }));
    });
  }

  guardAuth() {
    return from(this.auth().then(result => {
      return true;
    }).catch(error => {
      this.router.navigate(['/login']);
      return false;
    }));
  }

  setLangtoUser(uid: string, lang: string) {
    this.firestore.collection("users")
      .doc(uid)
      .set({ lang: lang }, { merge: true })
      .then(x => console.log('add lang', x));
  }
}
