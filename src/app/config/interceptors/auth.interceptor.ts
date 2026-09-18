import { Injectable, ɵConsole } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e : any) => {
        console.log('AuthInterceptor: ', e);
        if(e.status == 401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if(e.status == 403){
          swal.fire('Acceso denegado', `No tienes acceso`, 'warning');
          //this.router.navigate(['/index']);
        }else{
          let error=null;
          if(e && e.error && e.error.error){
            error=  e.error.error;
          }
          
          swal.fire('ERROR', error ? error : 'Ocurrio un error al realizar la operacion','warning');
        }
        return throwError(e);
     })
    );
  }

}
