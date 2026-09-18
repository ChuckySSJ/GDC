import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return false;
    }

    let roles = next.data['roles'] as string[];
    if(this.authService.hasRole(roles)){
      return true;
    }
    swal.fire('Acceso denegado', `No tienes acceso a este recurso`, 'warning');
    this.router.navigate(['/index']);
    return true;
  }

}
