import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, AfterViewInit {

  @ViewChild('inputToFocus') inputToFocus;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.inputToFocus.setFocus(), 300);
  }

  ngOnInit() {
  }

  login(formValue: any) {
    console.log(formValue);

  }
  
  errorMessage;
  successMessage;
  
  register(value){
    this.auth.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
      
      this.router.navigate(['login'])
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }



}
