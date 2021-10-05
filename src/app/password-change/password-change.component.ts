import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../Services/email.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  payload : any;
  error: string;
  message: string;
  
  constructor(private fb: FormBuilder,
    private service: EmailService,
    private router:Router) { }

  ngOnInit(): void {
  }
  ChangePasswordForm = this.fb.group({
    CurrentPassword : ['', [Validators.required, Validators.minLength(8)]],
    NewPassword: ['', [Validators.required, Validators.minLength(8)]],
    CnfrmPassword: ['', [Validators.required]]
   },{ 
     validator: [this.ConfirmedValidator('NewPassword', 'CnfrmPassword')]
   });

  ConfirmedValidator(NewPassword: string, CnfrmPassword: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[NewPassword];
      const matchingControl = formGroup.controls[CnfrmPassword];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
  }
  ChangePassword(currentpassword: String,newpassword: String){
    this.payload = this.service.getUserPayload();
    this.service.RegisteredFaculty(this.payload.Username,currentpassword).subscribe(
      res => {
        this.service.PasswordChange(this.payload.Username,newpassword).subscribe(
          res => {            
            this.error = "";
            this.message = "Password Updated Successfully";
            this.ChangePasswordForm.reset();
           // this.router.navigate(['/home']);
          },
          err => {
            this.message = "";
            this.error = "Error in updating Password";
          }
        );
      },
      err => {
        this.message = "";
        this.error = "Current password is incorrect";
      }
    )
  }
}
