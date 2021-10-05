import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { EmailService } from '../Services/email.service';
import { Global } from '../Global';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {

  data : string[][] = [];
  temp : string[] = [];
  selectedFiles: FileList;
  toggle : Boolean= false;
  AllCourses : any = [];
  listItems : Array<string> = [];
  //message : string;
  //flag : number = 0;

  constructor(private emailservice:EmailService,
    public gl: Global) { 
    }

  ngOnInit(): void {
    this.emailservice.IsStartReg().subscribe( (reg : Boolean)=>{
      this.emailservice.setToggle(reg);
      this.toggle = reg;
    //  console.log(this.toggle);
    });
    this.getCourses()
  }
  selectFile(event): void {
    if (event.target.files.length !== 1) throw new Error('Cannot use multiple files');
    this.selectedFiles = event.target.files;
  }
onFileChange() {
    // const target : DataTransfer =  <DataTransfer>(evt.target);
    
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    this.emailservice.DeleteCourses().subscribe( (courses) =>{
      if(courses){
        console.log(courses);
      }
      else {
        console.log("error in deleting");
      }
    });
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
    const bstr: string = e.target.result;
 
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    const wsname : string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
 
  //  console.log(ws);
 
    this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
 
    console.log(this.data);
 
    let x = this.data.slice(1);
    console.log(x);
    let q : number = 1;
    for(let i = 0; i < this.data.length; i++) {
      for(let j = 0; j < this.data[i].length; j++) {
        if(this.data[0][1] == "Class"){
          if(i==q && j==1)
          {
            let d : string = this.data[q][1];
            this.temp = d.split(',');
        //    console.log(this.temp);       
            this.emailservice.SemesterCourses(this.data[q][0],this.temp,this.data[q][2]).subscribe( (course) =>{
             if(course){
              //  this.flag++ ;
               console.log(course);
             }
             else {
               console.log("error in saving");
             }
           });
            q++;
          }   
         }
      }
    }
    // console.log("flag " + this.flag, "length " + x.length, "q " + q);
    // if(this.flag == x.length){
    //   this.message = "Courses Successfully Saved"
    // }
 };
 reader.readAsBinaryString(this.selectedFiles[0]);
 this.getCourses();
// reader.readAsBinaryString(target.files[0]);
 }
 ToggleFtn(){
   if(this.emailservice.getToggle() == true)
   {
    // this.gl.toggle = false;
    this.emailservice.setToggle(false);
   }
   else{
  //  this.gl.toggle = true;
    this.emailservice.setToggle(true);
   }
  // console.log(this.emailservice.getToggle());
   this.emailservice.ChangeReg(this.emailservice.getToggle()).subscribe( (reg) =>{
    if( reg != null){
      console.log(reg);
    }
    else {
      console.log("error in saving");
    }
  });
 }
 getCourses(){
  this.emailservice.getAllCourses().subscribe((courses : any)=>{
    if(courses){
      this.AllCourses = courses;
    }
    else{
      console.log("error in finding courses");
    }
  });
 }
}
