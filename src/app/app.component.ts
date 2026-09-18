import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'userManagementFrontEndpilin';

  constructor (public authService: AuthService, private router: Router){
    console.log('authService: ', authService.user.usuario);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
