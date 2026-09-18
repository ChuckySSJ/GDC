import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/users';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user?: User;
  private _token?: string;

  constructor(
    private http: HttpClient
  ) {}

  public get user(): User {
    if(this._user != null){
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('user') != null) {
      this._user = JSON.parse(sessionStorage.getItem('user')|| '') as User;
      return this._user;
    } else {
      return new User();
    }
  }
  public get token(): string {
    if(this._token != null){
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      return sessionStorage.getItem('token') || '';
    } else {
      return '';
    }
  }

  login(usuario: string, password: string) {
    return this.http.get<any>(environment.apiUrl+ 'api/authenticate/' + usuario + '/' + password);
}

  saveUser(data: any): void {
    let payload = this.getDataToken(data.token);

    this._user = new User();
    this._user.name = payload.name;
    this._user.role = payload.authorities[0];
    this._user.usuario = data.usuario;


    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  saveToken(accessToken: string): void {
    sessionStorage.setItem('token', accessToken);
  }

  getDataToken(accessToken: string): any {
    if(accessToken != null && accessToken.length > 0){
      return JSON.parse(atob(accessToken.split('.')[1]));
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    let payload = this.getDataToken(this.token);
    return payload != null;
  }

  logout(): void {
    this._user = null as any;
    this._token = null as any;
    sessionStorage.clear();
  }

  hasRole(roles: string[]){

    if(this.user == null || this.user.role == null || this.user.role.length == 0){
      return false;
    }

    return roles.includes(this.user.role);
  }

  save(user: any): Observable<any> {
    return this.http.post(environment.apiUrl+ 'api/save', user).pipe(
      map((response: any ) => {
        return response as any;
      },
      catchError((e: any )=> {
        console.error('e: ', e);
        return throwError(e);
      })
    ));
  }
}
