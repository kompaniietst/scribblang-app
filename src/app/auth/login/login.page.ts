import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {

  @ViewChild('input') inputToFocus;
  uid;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.inputToFocus.setFocus(), 300);
  }

  ngOnInit() { }

  errorMessage;
  successMessage;

  login(value: any) {

    // this.router.navigate(['/tabs/lists']);

    this.auth.doSignIn(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your can enter";

        // this.router.navigate(['login'])
        this.router.navigate(['start']);


        this.uid = res.user.uid;
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })

  }


  getUid() {
    return this.uid
  }
}
