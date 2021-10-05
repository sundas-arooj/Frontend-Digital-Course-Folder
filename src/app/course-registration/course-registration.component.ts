import { Component, OnInit,  Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../Services/email.service';
import { Router } from '@angular/router';
import { Courses, showClasses, SelectedClass } from '../Models/Courses';
import { Global } from '../Global';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.css']
})
export class CourseRegistrationComponent implements OnInit {
  // CReg: FormGroup
   public listItems : Array<string> = [];
   public checkboxItem : Courses[] = [];
   public display : showClasses[] = [];
   selectedClass : SelectedClass[] = [];
   courses : Array<string> = [];
   crdhrs : Array<number> = [];
   CrsRegData : Courses[] = [];
   userCourses : Courses[] =[];
   IsRegistered : Boolean = false;
   payload : any;

  // @Output() newCourseEvent = new EventEmitter<Courses>();


  constructor(private fb: FormBuilder,
   private http:HttpClient,
   private emailservice:EmailService,
   private router:Router,
   public gl: Global ) {
    this.payload = this.emailservice.getUserPayload();
    if(this.payload!=null){
      this.emailservice.getUserCourses(this.payload.Username).subscribe( (courses : Courses[]) =>{
        if( courses!=null && courses.length!= 0 ){
          this.IsRegistered = true;     
        }
        else {
          console.log("Unable to get courses");
        }
      });
    }    
  }

CReg = this.fb.group({
  // courses :['',[Validators.required]],
   coursesList : this.fb.array([
      this.addCourseFormGroup()
   ])
});

  ngOnInit(): void {
   var c : showClasses = {
     "show" : false
    }; 
    this.display[0] = c;
    this.showCourses();
  //  this.selectedClass = new Array<SelectedClass>();
  }

  addCourseFormGroup() : FormGroup {
   return this.fb.group({
   courName : ['',Validators.required],
   checkClass : ['', Validators.required]
  });
}
get formArray() {
  return (<FormArray>this.CReg.get('coursesList'));
}
getValidity(i) {
  return (<FormArray>this.CReg.get('coursesList')).controls[i].invalid;
}
getDirty(i) {
  return (<FormArray>this.CReg.get('coursesList')).controls[i].dirty;
}
getTouched(i) {
  return (<FormArray>this.CReg.get('coursesList')).controls[i].touched;
}
showCourses(){
this.emailservice.GetCourses().subscribe((courses : Courses[])=>{
  if(courses){
    console.log(courses);
    courses.forEach(course => {
      this.listItems.push(course.CourseName);
    });
    console.log(this.listItems);
  //  this.OnChangeCourse("SE",0);
   // this.listItem = courses.;
  }
  else{
    console.log("error in finding courses");
  }
});
}
removeCourse(CourseIndex : number){
   this.formArray.removeAt(CourseIndex);
   this.courses.splice(CourseIndex,1);
   this.selectedClass.splice(CourseIndex,1);
   this.crdhrs.splice(CourseIndex,1);
   this.checkboxItem.splice(CourseIndex,1);
}

addCourse(){
  // this.show=false;
  this.formArray.push(this.addCourseFormGroup());
  var c : showClasses = {
    "show" : false
   }; 
  this.display[this.formArray.length-1] = c;
   console.log(this.formArray.length);
}
OnChangeClasses(event : any, classs : string, index : number){
  if(event.target.checked){
    if(this.selectedClass[index] ){
      this.selectedClass[index].SlctClass.push(classs);
    }
    else{
      console.log("else");
      var c : SelectedClass = {
        "SlctClass" : []
      }
      this.selectedClass[index] = c;
      this.selectedClass[index].SlctClass.push(classs);
    }
  }
  else{
  this.selectedClass[index].SlctClass = this.selectedClass[index].SlctClass.filter(m => m!=classs);
  }
  console.log(this.selectedClass);
}

OnChangeCourse(courseName : string, index : number){
   // this.show[index] = true;
   console.log(courseName, index);
   this.courses[index] = courseName;
   console.log(this.courses[index]);
    if(this.selectedClass[index]){
       this.selectedClass[index].SlctClass = [];
     }
  
   this.emailservice.GetClasses(courseName).subscribe((classes : Courses[])=>{
     if(classes){
     // this.checkboxItem = classes[0].Classes;
    // this.checkboxItem[index].push(classes[0].Classes);
    this.crdhrs[index]=classes[0].CreditHrs;
    console.log(classes[0]);
    this.checkboxItem[index] = classes[0];
   // this.checkboxItem[index].Classes = classes[0].Classes;
    console.log(this.checkboxItem[index])
    this.display[index].show = true;
    }
    else{
      console.log("error in finding courses");
    }
  })
}
register(){
  this.courses.forEach((course,index) => {
    var c : Courses = {
      "CreditHrs" : 0,
      "CourseName" : "",
      "Classes" : []
    }
    this.CrsRegData[index] = c;
    this.CrsRegData[index].CourseName = course;
    this.CrsRegData[index].CreditHrs = this.crdhrs[index];
    this.CrsRegData[index].Classes = this.selectedClass[index].SlctClass; 
  });
  this.emailservice.RegisterCourses(this.payload.Username,this.CrsRegData).subscribe((response)=>{
    console.log(response);
    this.IsRegistered = true;
    this.router.navigate(['']);
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['/home']);
  // });
   // this.router.navigate(['../../home']);
    // HomeComponent.returned.next(false);
    // this.router.navigate(['home']); 
  //  this.router.navigateByUrl('/home');
 });
}
shown(index : number) : boolean{
  this.formArray.at(index).get('checkClass').value
return
}
 
}
