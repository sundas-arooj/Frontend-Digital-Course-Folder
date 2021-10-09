import { Component, OnInit } from '@angular/core';
import { Progress, ChartData, Dates } from '../Models/Progress';
import { EmailService } from '../Services/email.service';
import { Users, Percentage, Courses } from '../Models/Courses'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-admin-dasboard',
  templateUrl: './admin-dasboard.component.html',
  styleUrls: ['./admin-dasboard.component.css']
})
export class AdminDasboardComponent implements OnInit {

  semName: string;
  SemDates: Dates;
  startDate: any;
  endDate: any;
  DaysLimit: number;
  UsersPer: Percentage[] = [];
  RegUsers: Users[];
  quizDate: string[] = [];
  assignDate: string[] = [];
  lectureDate: string[] = [];
  midPaperDate: any;
  finalPaperDate: any;
  next: string;
  showDate: Boolean;
  temp2: string[];
  temp: string[];
  //savedFiles: number = 0;

  // Path creation
  coursess: Courses[];
  //path: String[] = [];
  //dir: String;
  //fileProgess: Progress[] = [];


  DashDatesForm = this.fb.group({
    SemName: ['', [Validators.pattern("^(Spring)?(Fall)?(Summer)?[-][0-9][0-9][0-9][0-9]$")]],
    StartDate : ['',[Validators.required]],
    EndDate: ['',[Validators.required]],
    MidsDate: ['',[Validators.required]],
    FinalsDate: ['',[Validators.required]],
  })


  constructor(private emailservice: EmailService,
    private fb: FormBuilder,
    private router:Router) {

  }

  ngOnInit(): void {
    this.DisplayDates();
  }
  DisplayDates() {
    this.emailservice.getDates().subscribe((dates: Dates) => {
      if (dates != null) {
        this.SemDates = dates;
        var nextDate = new Date();
        var date;
        this.temp = (dates.finalsPaper).split('/')
        date = this.temp[1] + '/' + this.temp[0] + '/' + this.temp[2];
        nextDate.setFullYear(new Date(date).getFullYear());
        nextDate.setMonth(new Date(date).getMonth());
        nextDate.setDate(new Date(date).getDate() + 25);


        console.log("Final date " + new Date(date));
        console.log("Next Date " + nextDate);
        console.log(new Date().getTime() > nextDate.getTime());
        if (new Date().getTime() > nextDate.getTime()) {
          this.showDate = true;
        }
        else {
          this.showDate = false;
          this.showUsers();
          // this.calPercentage();         
        }
      }
      else {
        this.showDate = true;
      }
    });
  }
//get all Input Dates
  getStartDate(date: string) {
    this.startDate = new Date(date);
  }
  getEndDate(date: string) {
    this.endDate = new Date(date);
  }
  getMidsDate(date: string) {
    this.midPaperDate = new Date(date);
    this.midPaperDate = this.midPaperDate.toLocaleDateString('en-GB');
  }
  getFinalsDate(date: string) {
    this.finalPaperDate = new Date(date);
    this.finalPaperDate = this.finalPaperDate.toLocaleDateString('en-GB');
  }
  getSemName(name: string) {
    this.semName = name;
  }

  getDate(date:string){
    console.log(date)
    console.log(new Date(date).toLocaleDateString('en-GB'));
  }

  //Save all dates 
  saveDate() {
    this.emailservice.SemesterName(this.semName).subscribe((data) => {
      if (data) {
        console.log(data);
        console.log(this.semName);
        this.emailservice.setSemester(this.semName);
      }
      else {
        console.log("error in saving name");
      }
    });
    this.emailservice.DeleteDates().subscribe((dates) => {
      if (dates) {
        console.log(dates);
        const diffInMs = Math.abs(this.endDate - this.startDate);
        var diff = diffInMs / (1000 * 60 * 60 * 24);
        this.DaysLimit = (diff - 10) / 4;
        //console.log(this.DaysLimit);
        var nextDate = new Date();
        nextDate.setDate(this.startDate.getDate() + this.DaysLimit);
        nextDate.setMonth(this.startDate.getMonth() + 1);
        nextDate.setFullYear(this.startDate.getFullYear());

        for (let i = 0; i < 4; i++) {
          this.next = nextDate.toLocaleDateString('en-GB');
          this.quizDate.push(this.next);
          this.assignDate.push(this.next);
          nextDate.setDate(nextDate.getDate() + this.DaysLimit);
        }
        nextDate.setDate(this.startDate.getDate() + 7);
        nextDate.setMonth(this.startDate.getMonth());
        nextDate.setFullYear(this.startDate.getFullYear());
        while (nextDate.getTime() < this.endDate.getTime()) {
          this.next = nextDate.toLocaleDateString('en-GB');
          this.lectureDate.push(this.next);
          nextDate.setDate(nextDate.getDate() + 7);
        }
        this.emailservice.saveDates(
          this.quizDate,
          this.assignDate,
          this.lectureDate,
          this.midPaperDate,
          this.finalPaperDate).subscribe((data) => {
            if (data) {
              console.log(data);
              this.showDate = false;
              this.showUsers()
            }
            else {
              console.log("error in saving dates");
            }
          })
      }
      else {
        console.log("error in deleting");
      }
    });
    const diffInMs = Math.abs(this.endDate - this.startDate);
    var diff = diffInMs / (1000 * 60 * 60 * 24);
    this.DaysLimit = (diff - 10) / 4;
    //console.log(this.DaysLimit);
    var nextDate = new Date();
    nextDate.setDate(this.startDate.getDate() + this.DaysLimit);
    nextDate.setMonth(this.startDate.getMonth() + 1);
    nextDate.setFullYear(this.startDate.getFullYear());

    for (let i = 0; i < 4; i++) {
      this.next = nextDate.toLocaleDateString('en-GB');
      this.quizDate.push(this.next);
      this.assignDate.push(this.next);
      nextDate.setDate(nextDate.getDate() + this.DaysLimit);
    }
    nextDate.setDate(this.startDate.getDate() + 7);
    nextDate.setMonth(this.startDate.getMonth());
    nextDate.setFullYear(this.startDate.getFullYear());
    while (nextDate.getTime() < this.endDate.getTime()) {
      this.next = nextDate.toLocaleDateString('en-GB');
      this.lectureDate.push(this.next);
      nextDate.setDate(nextDate.getDate() + 7);
    }
    this.emailservice.saveDates(this.quizDate,
      this.assignDate,
      this.lectureDate,
      this.midPaperDate,
      this.finalPaperDate).subscribe((data) => {
        if (data) {
          // console.log(data);
          this.showDate = false;
          this.showUsers()
        }
        else {
          console.log("error in saving dates");
        }
      })
  }
  showUsers() {
    this.emailservice.getUsers().subscribe((users: Users[]) => {
      if(users.length==0){
       console.log("NO user found ") ;
       return;
      }
      this.RegUsers = users;
      this.calPercentage();
    })
  }
  async calPercentage() {
    var fileProgess2 = []
    // console.log("reg Users length" + this.RegUsers.length);
    this.RegUsers.forEach((user) => {
      // console.log("" + user);
      var savedFiles = 0;
      var dir = "";
      var fileProgess = [];
      var path = [];
      if (user.Courses != null) {
        for (var k = 0; k < user.Courses.length; k++) {
          var val = user.Courses[k];
          var coursePath = this.emailservice.getSemester() + '/' + user.Name + '/' + val.CourseName + '/';
          for (var l = 0; l < val.Classes.length; l++) {
            var value = val.Classes[l];
            var temp: Progress = {
              "Class": value,
              "Course": val.CourseName,
              "CreditHrs": val.CreditHrs,
              "Folder": "Quizes",
              "Files": 0
            };
            fileProgess.push(temp);
            dir = coursePath + value + '/' + 'Quizes';
            path.push(dir);

            var temp1: Progress = {
              "Class": value,
              "Course": val.CourseName,
              "CreditHrs": val.CreditHrs,
              "Folder": "Assignments",
              "Files": 0
            };
            fileProgess.push(temp1);
            dir = coursePath + value + '/' + 'Assignments';
            path.push(dir);

            var temp2: Progress = {
              "Class": value,
              "Course": val.CourseName,
              "CreditHrs": val.CreditHrs,
              "Folder": "Lectures",
              "Files": 0
            };
            fileProgess.push(temp2);
            dir = coursePath + value + '/' + 'Lectures';
            path.push(dir);

            var temp3: Progress = {
              "Class": value,
              "Course": val.CourseName,
              "CreditHrs": val.CreditHrs,
              "Folder": "Mids",
              "Files": 0
            };
            fileProgess.push(temp3);
            dir = coursePath + value + '/' + 'Mids/AvgPaper';
            path.push(dir);
            dir = coursePath + value + '/' + 'Mids/BestPaper';
            path.push(dir);
            dir = coursePath + value + '/' + 'Mids/WorstPaper';
            path.push(dir);

            var temp4: Progress = {
              "Class": value,
              "Course": val.CourseName,
              "CreditHrs": val.CreditHrs,
              "Folder": "Finals",
              "Files": 0
            };
            fileProgess.push(temp4);
            dir = coursePath + value + '/' + 'Finals/AvgPaper';
            path.push(dir);
            dir = coursePath + value + '/' + 'Finals/BestPaper';
            path.push(dir);
            dir = coursePath + value + '/' + 'Finals/WorstPaper';
            path.push(dir);
          };   //inner loop
        };     //outer loop
      }
      else {
        console.log("Unable to get courses");
      }
      this.emailservice.sendPath(path).subscribe((fileNumbr: Number[]) => {
        // console.log(fileNumbr);
        for (var m = 0; m < fileProgess.length; m++) {
          var obj = fileProgess[m];
          if (obj.Folder == "Mids" || obj.Folder == "Finals") {
            obj.Files = +fileNumbr[m] + +fileNumbr[m + 1] + +fileNumbr[m + 2];
            m = m + 3;
          }
          else {
            obj.Files = fileNumbr[m];
            m = m + 1;
          }
          console.log(obj);
        };
        fileProgess2.push(fileProgess);

        //   console.log(this.fileProgess);
        //   this.fileProgess.forEach((obj)=>{  
        //     console.log("Files ", +obj.Files);
        //     console.log("Saved Files ", +this.savedFiles);
        //     this.savedFiles = +obj.Files + +this.savedFiles;
        //   }); 
        //  // console.log("Saved Files: "+ this.savedFiles);
        //   this.savedFiles = (+this.savedFiles/reqFiles)*100
        //   this.UsersPer.push({"Name":user.Name,"Percentage":this.savedFiles});
        var reqFiles = 14 + this.SemDates.Lectures.length;
        // console.log("current user", user);
        this.calculatePercentage(fileNumbr, reqFiles, user.Name, user.Username);

      });
      // console.log(this.fileProgess);

      //console.log(this.getfiles.CreatePaths(user));
      // this.getfiles.CreatePaths(user).forEach((val)=>{
      //   console.log(val);
      //   this.savedFiles = +this.savedFiles + +val.Files; 
      //   console.log("Inside Files "+ this.savedFiles);
      //   console.log("Inside "+ (+this.savedFiles/reqFiles)*100)
      // });
      // this.savedFiles = (+this.savedFiles/reqFiles)*100
      // console.log("Outside "+ this.savedFiles);
      // this.UsersPer.push({"Name":user.Name,"Percentage":this.savedFiles});
    });
  }

  calculatePercentage(fileProgess2: Number[], reqFiles: number,Name : string, userName: string) {
    var savedFiles = 0;
    for (var n = 0; n < fileProgess2.length; n++) {
      var obj = fileProgess2[n];
      savedFiles = savedFiles + parseInt(obj.toString());
    };
    // console.log("object", obj);
    // //console.log("Files ", +obj.Files);
    // console.log("object comes here ", obj);
    // console.log("Saved Files ", +savedFiles);
    // console.log("req files", reqFiles);
    //savedFiles = +obj.Files + +savedFiles;
    savedFiles = (+savedFiles / reqFiles) * 100
    this.UsersPer.push({
      "Name": Name, "Percentage": Math.round(savedFiles) , "Username": userName
    });
    console.log(this.UsersPer);
  }
  LoadDashboard(Name : string,Username : string){
    this.emailservice.setUser(Name,Username);
    this.router.navigate(['home/dashboard']);
  }
}