import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup = this.initForm({});
  constructor(private authService: AuthService, private router: Router ) { }


  ngOnInit(): void {
    console.log('this.form: ', this.form);
  }

  initForm(user: any) {

    return new FormGroup({
      id: new FormControl(user.id),
      usuario: new FormControl(user.usuario, [Validators.required]),
      password: new FormControl(user.password, [Validators.required]),
      newPassword: new FormControl(user.newPassword, [Validators.required]),
      
    },{ validators: this.checkPasswords });

}

signIn(){
  console.log("form: ", this.form.value);
  const data = this.form.value as any;
  data.rol='USER';
    this.authService.save(data).subscribe(response=>{ 
      console.log("response: ", response)
      console.log("modal: ")
      this.router.navigate(['/login']);
    }
   ) 
  }
  checkPasswords: ValidatorFn = (group: AbstractControl | any):  ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('newPassword').value;
    return pass === confirmPass ? null : { notSame: true }
  }
}
