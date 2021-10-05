import { SignupDetails } from './Models/signupDetail'
import { Injectable } from '@angular/core';

// const mongoose = require("mongoose");

@Injectable()
export class Global {
    signupDetails: SignupDetails[]=[];
    toggle : Boolean = false;
    UserLoggedIn : String;
    userName : String;
    currentCourse : String;
    currentClasses: String[];
    Path : String;
    IsAdmin : Boolean;
}