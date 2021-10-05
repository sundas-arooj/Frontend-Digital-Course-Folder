import { Component, OnInit } from '@angular/core';
import { Global } from '../Global';
import { EmailService } from '../Services/email.service';
import { Courses } from '../Models/Courses';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-class-folders',
  templateUrl: './class-folders.component.html',
  styleUrls: ['./class-folders.component.css']
})
export class ClassFoldersComponent implements OnInit {
  icon : String[] = [];
  open : Boolean[] = [];
  innerIcon : String[] = [];
  innerOpen : Boolean[] = [];
  classes : String[] = [];
  course : String;
  payload : any;
  length : number;


  constructor( public gl: Global,
    private router:Router,
    public emailservice:EmailService) { }

  ngOnInit(): void {
    this.payload = this.emailservice.getUserPayload();
    if(this.payload!=null){
      this.emailservice.getUserCourses(this.payload.Username).subscribe( (courses : Courses[]) =>{

        if( courses!= null ){
          // //console.log(courses)
          // //this.userCourses=courses; 
          // courses.forEach((course)=>{
          //   if(course.CourseName==this.gl.currentCourse)
          //   {
          //     console.log(course.CourseName)
          //     console.log(course.Classes)
          //     this.userCourses=course;
          //     //console.log("classes of selected course"+this.userCourses.Classes)
          //   }  
          // })
          //console.log(this.userCourses.Classes);
          // Get from local storage
          this.course = this.emailservice.getCourse();
          this.classes = this.emailservice.getClasses();
          this.classes.forEach((value,index)=>{
            this.icon[index]="fa fa-angle-right";
            this.open[index]=false;
          });
          for(let i = 1; i < this.classes.length*2 ; i++)
          {
            this.innerIcon[i]="fa fa-angle-right";
            this.innerOpen[i]=false;
          }
        }
        else {
          console.log("Unable to get courses");
        }
      });
    }
    console.log(this.icon.length);
    console.log(this.open.length);

  }
  // ngDoCheck() : void {
  //   this.payload = this.emailservice.getUserPayload();
  //   if(this.payload!=null){
  //     this.emailservice.getUserCourses(this.payload.Username,"Fall20").subscribe( (courses : Courses[]) =>{

  //       if( courses!= null ){
  //         this.course = this.emailservice.getCourse();
  //         this.classes = this.emailservice.getClasses();
  //         this.classes.forEach((value,index)=>{
  //           this.icon[index]="fa fa-angle-right";
  //           this.open[index]=false;
            
  //         })
  //       }
  //       else {
  //         console.log("Unable to get courses");
  //       }
  //     });
  //   }
  //   console.log(this.icon.length);
  //   console.log(this.open.length);
  // }

  openFolders(index){
    this.open[index] = !this.open[index];
    if(this.icon[index] == 'fa fa-angle-right'){
      this.icon[index] = 'fa fa-angle-down';
    }
    else {
      this.icon[index] = 'fa fa-angle-right';
    }
  }
  innerOpenFolders(index){
    this.innerOpen[index] = !this.innerOpen[index];
    if(this.innerIcon[index] == 'fa fa-angle-right'){
      this.innerIcon[index] = 'fa fa-angle-down';
    }
    else {
      this.innerIcon[index] = 'fa fa-angle-right';
    }
  }

  showFiles(folder,index){
    // this.gl.Path="Fall20/"+this.gl.UserLoggedIn+"/"+this.gl.currentCourse+"/"+this.gl.currentClasses[index]+"/"+folder;
    var Path;
    Path=this.emailservice.getSemester()+"/"+this.payload.Name+"/"+this.emailservice.getCourse()+"/"+this.emailservice.getClasses()[index]+"/"+folder;
    this.emailservice.setPath(Path);
    this.router.navigate(['home/fileManager']);
  }
}
