import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
// import 'rxjs/add/operator/toPromise'
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';
import { Courses } from '../Models/Courses';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient) { }
  uri= 'http://ncflabnccs.nayatel.net:10012/AUfolder';
  
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  ////////////////////////////////TEST///////////////////////////////////
  // course = this.getUserCourses(this.getUserPayload().UserName);
  // private messageSource = new BehaviorSubject(this.course);
  // currentMessage = this.messageSource.asObservable();
  // changeMessage(message: any) {
  //   this.messageSource.next(message);
  // }

  
// --- signup -----
  GetUser(username) { 
   // console.log("call");
    return this.http.get(`${this.uri}/getuser?UserName=${username}`);
  }
  sendRequest(obj){
    console.log(obj.Name);
    return this.http.post(`${this.uri}/sendMail`, {"UserDetails": obj, "Semester": this.getSemester()});
  }
  deleteName(){
    localStorage.removeItem('Name');
    localStorage.removeItem('Username');
  }
// -----------------
// ---- login -----
  // RegisteredFaculty(username,password){ 
  //   return this.http.get(`${this.uri}/getfaculty?Username=${username}&Password=${password}`);
  // }
  RegisteredFaculty(username,password){ 
    var obj={
      UserName : username,
      Password : password
    }
    return this.http.post(`${this.uri}/authenticate`,obj,this.noAuthHeader);
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
// ---------------
// ---- course management -----
DeleteCourses(){
  return this.http.get(`${this.uri}/deleteCourses`);
}
SemesterCourses(course,classes,crdHrs){
  var obj={
    CName : course,
    Classes : classes,
    Credit_Hrs : crdHrs
  }
  return this.http.post(`${this.uri}/saveCourse`, obj);
}
ChangeReg(IsStart){
  return this.http.post(`${this.uri}/StartReg`, {"IsStart":IsStart});
}
IsStartReg(){
  return this.http.get(`${this.uri}/StartReg`);
}
setToggle(toggle)
{
  localStorage.setItem("Toggle", toggle);
}
getToggle() : Boolean {
  if(localStorage.getItem('Toggle') == "true")
  {
    return true;
  }
  else
  {
    return false;
  }
}

// ------------------------
// --------- course registration ---------------
  GetCourses(){
    return this.http.get(`${this.uri}/getcourses`);
  }
  GetClasses(course){
    return this.http.get(`${this.uri}/classes?name=${course}`);
  }
  RegisterCourses(UserName,CrsRegData){
    var obj={
      UName : UserName,
      RegCrs : CrsRegData,
      Semester: this.getSemester()
    }
    return this.http.post(`${this.uri}/registerCourse`,obj);
  }
  // ------------------------------------

  //..............Home courses............
  getUserCourses(Username)
  {
    return this.http.get(`${this.uri}/userCourses?username=${Username}&semesterName=${this.getSemester()}`);
  }
  setCourseClass(course,classes)
  {
    localStorage.setItem("course", course);
    localStorage.setItem("classes", JSON.stringify(classes));
  }
  setSemester(semester)
  {
    localStorage.setItem("semester", semester);
  }
  getSemester() {
    return localStorage.getItem('semester');
  }
  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
  // payload{_id, Name, Username, IsAdmin}
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }



  VerifyToken() {
    console.log("In service");
    return this.http.get(`${this.uri}/verifyToken`);
  }

  getSemName() {
    return this.http.get(`${this.uri}/SemName`);      
  }
  //......................................

  //..............admin-dashboard..........
  saveDates(quizdates, assignDates, lectureDates, midsDate, finalsDate)
  {
    var obj={
      Quizes : quizdates,
      Assignments : assignDates,
      Lectures : lectureDates,
      midsPaper : midsDate,
      finalsPaper : finalsDate
    }
    return this.http.post(`${this.uri}/saveDates`,obj);
  }

  //get user by cuurent semester
  getUsers(){
    return this.http.get(`${this.uri}/getUsers?semester=${this.getSemester()}`);
  }
  DeleteDates(){
    return this.http.get(`${this.uri}/deleteDates`);
  }
  SemesterName(name){
    return this.http.post(`${this.uri}/SemName`, {"semName":name});
  }
  setUser(name,username)
  {
    localStorage.setItem("Name", name);
    localStorage.setItem("Username", username);
  }
  //......................................

  //..............user-dashboard..........

  sendPath(pathArray)
  {
    return this.http.post(`${this.uri}/getFilesNo`,pathArray);
  }

  getDates()
  {
    return this.http.get(`${this.uri}/getDates`);
  }
  getName() {
    return localStorage.getItem('Name');
  }
  getUserName(){
    return localStorage.getItem('Username');
  }
  // .....................................
  // ----------- class folders ------------
  getClasses() {
    return (JSON.parse(localStorage.getItem('classes')));
  }
  getCourse() {
    return localStorage.getItem('course');
  }
  setPath(path)
  {
    localStorage.setItem("Path", path);
  }
  // --------------------------------------
  //----------------app componenet-------------
  deleteAll() {
    localStorage.removeItem('token');
    localStorage.removeItem('course');
    localStorage.removeItem('classes');
    localStorage.removeItem('Path');
    localStorage.removeItem('Toggle');
    localStorage.removeItem('Name');
    localStorage.removeItem('Username');
    localStorage.removeItem('semester');
  }
  //-----------------------------------------
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if(userPayload != null)
    {
      return true;
    }
    else {
      return false;
    }
  }
  // ------------------- edit courses -------------------------
  getAllCourses()
  {
    return this.http.get(`${this.uri}/getAllcourses?semesterName=${this.getSemester()}`);
  }
  editCourses(uname,courses){
    var obj={
      Uname : uname,
      RegCrs : courses,
      SemesterName : this.getSemester()
    }
    return this.http.post(`${this.uri}/editCourses`,obj);
  }
  // ------------------------- Password Change ------------------------
  PasswordChange(uname,newpassword){
    var obj = {
      UserName : uname,
      Password: newpassword
    }
    return this.http.post(`${this.uri}/changePassword`,obj)
  }
  // ------------------------- Reset Password --------------------
  requestReset(body){
    return this.http.post(`${this.uri}/req-reset-password`, body);
  }

  newPassword(body){
    return this.http.post(`${this.uri}/new-password`, body);
  }

  ValidPasswordToken(body){
    return this.http.post(`${this.uri}/valid-password-token`, body);
  }
}


