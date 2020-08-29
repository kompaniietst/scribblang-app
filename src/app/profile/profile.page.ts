import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(private auth: AuthService) { }

  logout = () => this.auth.logout();


}
