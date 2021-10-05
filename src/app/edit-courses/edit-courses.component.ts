import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Courses, SelectedClass, showClasses } from '../Models/Courses';
import { EmailService } from '../Services/email.service';

@Component({
  selector: 'app-edit-courses',
  templateUrl: './edit-courses.component.html',
  styleUrls: ['./edit-courses.component.css']
})
export class EditCoursesComponent implements OnInit {
  user : any;
  SelectedUname: string;
 // CReg: FormGroup;
  public listItems : Array<string> = [];
  public checkboxItem : Courses[] = [];
  public display : showClasses[] = [];
  selectedClass : SelectedClass[] = [];
  SelectedCourses : Array<string> = [];
  SelectedCrdhrs : Array<number> = [];
  CrsRegData : Courses[] = [];
  AllCourses : any = [];
  
  CReg = this.fb.group({
    coursesList : this.fb.array([])
 });

  constructor(private route : ActivatedRoute,
    private service : EmailService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.SelectedUname = params[`username`];
      this.service.getUserCourses(params[`username`]).subscribe((res) => {
        this.user = res;
        this.getValues();
        this.showCourses();
      });
    });
  }
  showCourses(){
    this.service.getAllCourses().subscribe((courses : any)=>{
      if(courses){
        this.AllCourses = courses;
       // console.log(courses);
        courses.forEach(course => {
          this.listItems.push(course.CourseName);
        });
      //  console.log(this.listItems);
      //  this.OnChangeCourse("SE",0);
       // this.listItem = courses.;
      }
      else{
        console.log("error in finding courses");
      }
    });
    }
  getValues() {
    const control = <FormArray> this.CReg.get('coursesList');    
    for(let row of this.user) {
       const temp = this.fb.group({
        courName : row['CourseName'],
        checkClass : this.setclasses(row['Classes'])
       });
      this.checkboxItem[control.length] = row['Classes'];
      this.SelectedCourses[control.length] = row['CourseName'];
      var c : SelectedClass = {
        "SlctClass" : []
      }
      this.selectedClass[control.length] = c;
      this.selectedClass[control.length].SlctClass = row['Classes'];
      this.SelectedCrdhrs[control.length] = row['CreditHrs']
       control.push(temp);
    }
 }
 setclasses(x) {
  let arr = new FormArray([])
  for(let classs of x){
    arr.push(this.fb.group({
      classes : classs
    }))
  
  }
  return arr;
}
//  classes(row,index) {
//   const control = <FormArray> this.formArray[index].get('checkClass');
//   for(let classs of row) {
//      const temp = this.fb.group({
//       classes : classs
//      });
//      control.push(temp);
//     }
// }
 get formArray() {
  return (<FormArray>this.CReg.get('coursesList'));
}

 removeCourse(CourseIndex : number){
  this.formArray.removeAt(CourseIndex);
  this.SelectedCourses.splice(CourseIndex,1);
  this.selectedClass.splice(CourseIndex,1);
  this.SelectedCrdhrs.splice(CourseIndex,1);
  this.checkboxItem.splice(CourseIndex,1);
}
addCourseFormGroup() : FormGroup {
  return this.fb.group({
  courName : ['',Validators.required],
  checkClass : ['', Validators.required]
 });
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
// OnChangeClasses(event: any,classs : string,  index : number){
//   console.log(event);
//   console.log(classs);
// }
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
 this.selectedClass[index].SlctClass.sort();
 console.log(this.selectedClass);
}

OnChangeCourse(courseName : string, index : number){
  // this.show[index] = true;
  //console.log(courseName, index);
  this.SelectedCourses[index] = courseName;
   if(this.selectedClass[index]){
      this.selectedClass[index].SlctClass = [];
    }
    else{
      var c : SelectedClass = {
        "SlctClass" : []
      }
      this.selectedClass[index] = c;
    }
    let obj = this.AllCourses.find(obj => obj.CourseName == courseName);
    
    
    const control = <FormArray> this.CReg.get('coursesList');    
       const temp = this.fb.group({
        courName : courseName,
        checkClass : this.setclasses(obj.Classes)
       });
       this.checkboxItem[index] = obj['Classes'];
       this.selectedClass[index].SlctClass = obj['Classes'];
       this.SelectedCrdhrs[index] = obj['CreditHrs'];
      //  control[index] = this.fb.group({
      //   courName : '',
      //   checkClass : new FormArray([])
      //  });
     //  control[index] = temp;
       control.removeAt(index);
       control.insert(index,temp); 
       console.log("temp ", temp)
       console.log("control ", control);
//   this.service.GetClasses(courseName).subscribe((classes : Courses[])=>{
//     if(classes){
//       this.crdhrs[index]=classes[0].CreditHrs;
//       console.log(classes[0]);
//      // this.checkboxItem[index] = classes[0];
//      // console.log(this.checkboxItem[index])
//    }
//    else{
//      console.log("error in finding courses");
//    }
//  })
}
register(){
  this.service.editCourses(this.SelectedUname,this.user).subscribe((res)=>{
    console.log(res);
    if(res){
      console.log(res);
      this.SelectedCourses.forEach((course,index) => {
        var c : Courses = {
          "CreditHrs" : 0,
          "CourseName" : "",
          "Classes" : []
        }
        this.CrsRegData[index] = c;
        this.CrsRegData[index].CourseName = course;
        this.CrsRegData[index].CreditHrs = this.SelectedCrdhrs[index];
        this.CrsRegData[index].Classes = this.selectedClass[index].SlctClass; 
      });
      console.log(this.CrsRegData);
      this.service.RegisterCourses(this.SelectedUname,this.CrsRegData).subscribe((response)=>{
        console.log(response);
      })
    }
  });
}
}
