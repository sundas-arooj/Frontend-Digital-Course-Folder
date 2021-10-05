import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { NavbarService } from '../Services/navbar.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Global } from '../Global';
import { EmailService } from '../Services/email.service';
import { FileUploadService } from '../Services/file-upload.service';
import { Courses } from '../Models/Courses';
import { Subject } from 'rxjs';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mobileQuery: MediaQueryList;
  IsAdmin : Boolean;
  userCourses : Courses[] =[];
  payload : any; 
  toggle : Boolean = false;
  subscription: Subscription;
  semesterName : string;
 // public static returned: Subject<any> = new Subject();

 private _mobileQueryListener: () => void;

  constructor(public nav: NavbarService,
    private router:Router,
    private route : ActivatedRoute,
    public gl: Global,
    private emailservice:EmailService,
    private newService : FileUploadService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
      this.nav.show();
      this.payload = this.emailservice.getUserPayload();
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
   this._mobileQueryListener = () => changeDetectorRef.detectChanges();
   this.mobileQuery.addListener(this._mobileQueryListener);
      // console.log("here in login");    
    }

  ngOnInit(): void {
    this.semesterName = this.emailservice.getSemester();
    this.emailservice.VerifyToken().subscribe(
      res => {
       // this.userDetails = res['user'];
       this.loadData();
       this.LoadSemName();
      },
      err => { 
        console.log(err);
        
      }
    );
  }
  LoadSemName(){
    this.emailservice.getSemName().subscribe((sem: string)=>{
        console.log(sem);
        if(sem){
          this.emailservice.setSemester(sem);
        }
        else{
          console.log("Semester not found");
        }
      });
  }
  loadData() {
      if(this.payload!=null){
       // console.log(this.payload);
        if(!this.payload.IsAdmin){
          this.emailservice.IsStartReg().subscribe( (reg : Boolean)=>{
            if(reg!=null){
              // this.gl.toggle = reg;
              // console.log(this.gl.toggle);
              this.emailservice.setToggle(reg);
              this.toggle = reg;
             // console.log(this.emailservice.getToggle());
            }
          });
        //  console.log(this.payload.Username);

        //this.subscription = this.emailservice.currentMessage.subscribe((Courses : any) => this.userCourses = Courses)
          
        this.emailservice.getUserCourses(this.payload.Username).subscribe( (courses : Courses[]) =>{
           // console.log("Outside if ",courses);
            if(courses!=null && courses.length!= 0 ){
             //console.log(courses)
              this.userCourses=courses;  
            }
            else {
              console.log("Unable to get courses");
            }
          });
        } 
      } 
  }
  // addCourse(newCourse: Courses) {
  //   this.userCourses.push(newCourse);
  //   console.log("event add course : "+ this.userCourses );
  // }
   //  HomeComponent.returned.subscribe(res => {
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationEnd) { 
      
   // }
//    });
    

  //  this.IsAdmin = JSON.parse(this.route.snapshot.paramMap.get('flag'));
  //   alert(JSON.parse(this.route.snapshot.paramMap.get('user')));
  ngDoCheck() : void {
        
  }

  LoadClasses(crs: String){
    console.log(crs);
  //  this.gl.currentCourse=course;
    var classes = [];
    this.userCourses.forEach((course)=>{
      if(course.CourseName == crs)
      {
       // this.gl.currentClasses=course.Classes;
        classes = course.Classes;
        //console.log("classes of selected course"+this.userCourses.Classes)
      }  
    })
    this.emailservice.setCourseClass(crs,classes);
    this.router.navigate(['home/classFolders']);
  }
  Logout () {
    this.emailservice.deleteAll();
    this.router.navigate(['']);;
  };
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
