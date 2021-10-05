import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../Services/email.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css']
})
export class RequestResetPasswordComponent implements OnInit {
  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private service: EmailService,
    private router: Router,
   ) {

  }


  ngOnInit() {

    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      'username': new FormControl(null, [Validators.required])
    });
  }


  RequestResetUser(form) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      console.log(this.RequestResetForm.value)
      this.service.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['']);
          }, 3000);
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
}
