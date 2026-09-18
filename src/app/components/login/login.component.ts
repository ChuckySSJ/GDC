import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  usuario: string = '';
  password: string = '';

  login(){
    this.usuario = this.usuario ? this.usuario .trim() : '';
    this.password = this.password ? this.password.trim() : '';
   this.authService.login(this.usuario, this.password).subscribe(response => {
    this.authService.saveUser(response);
    this.authService.saveToken(response.token);
    this.router.navigate(['/home']);
    let user = this.authService.user;
    console.log('user : ', user);
  }, error => {
    console.log('Error, ', error);
    Swal.fire('Error Al Iniciar Sesión', 'EL Usuario o la contraseña incorrectos', 'error');
  });
}

  ngOnInit(): void {
if(this.authService.isAuthenticated()){
      this.router.navigate(['/home']);
    }
  }

}
