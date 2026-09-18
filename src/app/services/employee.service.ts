import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public urlEndPoint = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) {}
  getEmployees(showActive : any): Observable<any[]> {
    return this.http.get(this.urlEndPoint + 'employeeController/getEmployees/'+ showActive).pipe(
        map((response: any) => {
            return response as any[];
        }
    ));
}

save(employee: any, file: any): Observable<any> {
  const form= new FormData();
  form.append('json', JSON.stringify(employee));
  form.append('file', file);
  return this.http.post(this.urlEndPoint + 'employeeController/save', form).pipe(
    map((response: any ) => {
      return response as any;
    },
    catchError((e: any )=> {
      console.error('e: ', e);
      return throwError(e);
    })
  ));
}

update(employee: any, file: any): Observable<any> {
  const form= new FormData();
  form.append('json', JSON.stringify(employee));
  form.append('file', file);
  return this.http.post(this.urlEndPoint + 'employeeController/update', form).pipe(
    map((response: any ) => {
      return response as any;
    },
    catchError((e: any )=> {
      console.error('e: ', e);
      return throwError(e);
    })
  ));
}

delete(employee: any): Observable<any> {
  return this.http.post(this.urlEndPoint + 'employeeController/delete', employee).pipe(
    map((response: any ) => {
      return response as any;
    },
    catchError((e: any )=> {
      console.error('e: ', e);
      return throwError(e);
    })
  ));
}

bajaDefinitiva(employee: any): Observable<any> {
  return this.http.post(this.urlEndPoint + 'employeeController/bajaDefinitiva', employee).pipe(
    map((response: any ) => {
      return response as any;
    },
    catchError((e: any )=> {
      console.error('e: ', e);
      return throwError(e);
    })
  ));
}

getPDF(id: any){
  
  const url = this.urlEndPoint + 'employeeController/getPdf/' + id;
  
  const httpOptions = {
    'responseType'  : 'arraybuffer' as 'json'
     //'responseType'  : 'blob' as 'json'        //This also worked
  };
  
  return this.http.get<any>(url, httpOptions);
  
  }

  getZip(tipoPdf:any){
  
    const url = this.urlEndPoint + 'employeeController/getZip/'+ tipoPdf;
    
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
       //'responseType'  : 'blob' as 'json'        //This also worked
    };
    
    return this.http.get<any>(url, httpOptions);
    
    }

}
