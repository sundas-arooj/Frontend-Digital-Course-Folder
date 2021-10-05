import { Component, OnInit } from '@angular/core';
import { EmailService } from '../Services/email.service';
import {Users} from '../Models/Courses'
import { Router } from '@angular/router';

@Component({
  selector: 'app-faculty-management',
  templateUrl: './faculty-management.component.html',
  styleUrls: ['./faculty-management.component.css']
})
export class FacultyManagementComponent implements OnInit {

  RegUsers : Users[];
  constructor(private emailservice:EmailService,
    private router:Router) { }

  ngOnInit(): void {
    this.showUsers();
  }
  showUsers(){
    this.emailservice.getUsers().subscribe((users : Users[])=>{
      this.RegUsers = users
      console.log(this.RegUsers);
    });
    console.log(this.RegUsers);
  }
  MakeAdmin(Name,Username){
    this.emailservice.setUser(Name,Username);
    this.router.navigate(['home/signup',{flag:true}]);
  }
}