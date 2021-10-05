import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../Services/navbar.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { EmailService } from '../Services/email.service';
import  {SignupDetails}  from '../Models/signupDetail';
import { Global } from '../Global';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error : string;
  checkAdmin : Boolean;
  showPassword : Boolean = false;
  passwordToggleIcon : string = 'fas fa-eye-slash';
  constructor(
    private router:Router,
    public nav: NavbarService,
    private fb: FormBuilder,
    private emailservice:EmailService,
    public gl: Global 
    ) {
      this.nav.hide();
     }

  ngOnInit(): void {
    if (this.emailservice.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    }   
  }
  signinForm = this.fb.group({
    Username:['',[Validators.required]],
    Password: ['', [Validators.required, Validators.minLength(8)]]
  });
togglePassword(){
  this.showPassword = !this.showPassword;
  if(this.passwordToggleIcon == 'fas fa-eye'){
    this.passwordToggleIcon = 'fas fa-eye-slash';
  }
  else {
    this.passwordToggleIcon = 'fas fa-eye';
  }
}

  Verify(username:String,password:String)
  {
    if(this.signinForm.pristine || this.signinForm.invalid){
      this.signinForm.get('Username').markAsTouched();
      this.signinForm.get('Password').markAsTouched();
    }
    else {
       this.emailservice.RegisteredFaculty(username,password).subscribe(
        res => {
          this.emailservice.setToken(res['token']);
          this.router.navigate(['/home']);
        },
        err => {
          this.error = "User does not exist";
        }
       );
      //   (user : SignupDetails) =>{
      //   if( user!= null && user.UserName == username){
      //    // this.checkAdmin = user.IsAdmin;
      //    this.gl.UserLoggedIn = user.Name;
      //    this.gl.userName = user.UserName;
      //    this.gl.IsAdmin = user.IsAdmin;
      //     this.router.navigate(['/home']);
      //     console.log("user found");
      //   }
      //   else {
      //     this.error="User does not exist"
      //   }
      // });
    }
  }
  LoadComponent(){
    this.router.navigate(['home']);
  }

}
