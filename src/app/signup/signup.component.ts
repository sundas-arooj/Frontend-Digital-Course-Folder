import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../Global';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import  {SignupDetails}  from '../Models/signupDetail';
import { EmailService } from '../Services/email.service';
import { NavbarService } from '../Services/navbar.service';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('TabGroup',{static:false}) TabGroup: MatTabGroup;
  passwords: FormGroup = new FormGroup({});
  error : string;
  IsAdmin : Boolean;
  ReadOnly : Boolean;
  user : any = {};
  index : number;
  isActive : Boolean;
  ngOnInit(): void {
  }
  ngDoCheck() : void {
    this.IsAdmin = JSON.parse(this.route.snapshot.paramMap.get('flag'));
    if(this.IsAdmin){
    //  this.TabGroup._tabs.toArray()[0].disabled = true;
      this.index=1;
      this.isActive = true;
      this.ReadOnly = true;
      this.MakeAdmin();
    }
    else{
      this.isActive = false;
      this.emailservice.deleteName();
      this.user = {
        Name : '',
        Email : ''
      }
    }
  }

  constructor(
    private router:Router,
    private route : ActivatedRoute,
    private fb: FormBuilder,
    public nav: NavbarService,
    private gl: Global,
    private emailservice:EmailService) {
      this.nav.show();
     }
    MakeAdmin(){
      this.user = {
        Name : this.emailservice.getName(),
        Email : this.emailservice.getUserName()
      }
    }
    signupForm = this.fb.group({
      Name:['',[Validators.required, Validators.minLength(4), 
        Validators.pattern("^([a-zA-Z ]+)$")]],
      Email:['',[Validators.required,
        Validators.pattern("^([a-zA-Z0-9_]+)@?(students)\.(au)\.(edu)\.pk$")]],
      Username : ['', [Validators.required]],
        // Validators.pattern("[^ @]*@[^ @]*"),
        // this.emailDomainValidator 
      // Password: ['', [Validators.required, Validators.minLength(8)]],
      // CPassword: ['', [Validators.required]]
     },{ 
       validator: [//this.ConfirmedValidator('Password', 'CPassword'),
        this.ConfirmedValidator('Email', 'Username')]
     });

     AdminSignupForm = this.fb.group({
      AdminName:['',[Validators.required, Validators.minLength(4), 
        Validators.pattern("^([a-zA-Z ]+)$")]],
      AdminEmail:['',[Validators.required,
        Validators.pattern("^([a-zA-Z0-9_]+)@?(students)\.(au)\.(edu)\.pk$")]],
      AdminUsername : ['', [Validators.required, Validators.pattern("^([a-zA-Z]+)(_|-)?([a-zA-Z0-9]+)$")]],
     });
  onTabClick(event) {
    this.ReadOnly = false;
    if(event.index == 1)
    { 
      this.router.navigate(['home/signup',{flag:false}]);
    }
    else
    {
      this.router.navigate(['home/signup',{flag:false}]);
    }
  }
  
    // get username() { return this.signupForm.get('passwords.Password'); }
    // get password() { return this.signupForm.get('passwords.CPassword'); }
    // get email(): any {
    //   return this.signupForm.get('Email');
    // }

    // emailDomainValidator(control: FormControl) { 
    //    let email = control.value; 
    //    if (email && email.indexOf("@") != -1) { 
    //      let [_, domain] = email.split("@"); 
    //      if (domain !== "students.au.edu.pk") { 
    //        return {
    //          emailDomain: {
    //            parsedDomain: domain
    //          }
    //        }
    //      }
    //    }
    //    return null;
    //  }
   
    ConfirmedValidator(controlName: string, matchingControlName: string){
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
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

  Verify(name:String,email:String,username:String){

    if(this.IsAdmin){
      if (this.AdminSignupForm.invalid) {
        this.error = "Registration fails please try again";
        return;
      }
    }
    else {
      if (this.signupForm.invalid) {
        this.error = "Registration fails please try again";
        return;
      }
    }  
    var details : SignupDetails={
      "Name":name,
      "Email":email,
      "UserName": username,
      "IsAdmin" : this.IsAdmin
    }
    this.emailservice.GetUser(username).subscribe( (user : SignupDetails[]) =>{
      console.log(user)
      if(user.length != 0){
        this.error="User with this email already exist";  
        console.log("user with this email already exist");
      }
      else {
        console.log("else");
       // alert("else")
        this.gl.signupDetails.push(details);
        this.emailservice.sendRequest(details).subscribe( data => {
        let res:any = data; 
        console.log(` 👏 > 👏 ${name} is successfully register and mail has been sent`);
      },
      err => {
        console.log(err);
        alert(err);
        this.error = "Registration fails please try again";
      });      
      this.emailservice.deleteName();
      this.router.navigate(['']);
      }
    });
  }
  ngOnDestroy(){
    this.emailservice.deleteName();
  }
  // LoadComponent(){
  //   this.router.navigate(['']);
  // }
}
