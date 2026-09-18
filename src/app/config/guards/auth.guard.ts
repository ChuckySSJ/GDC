import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('this.authService.isAuthenticated(): ', this.authService.isAuthenticated());
    if(this.authService.isAuthenticated()){
      if(this.isTokenExpired()){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  isTokenExpired(): boolean {
    let token = this.authService.token;
    let payload = this.authService.getDataToken(token);
    let now = new Date().getTime() / 100;
    if(payload.exp > now){
      return true;
    } else {
      return false;
    }
  }

}
