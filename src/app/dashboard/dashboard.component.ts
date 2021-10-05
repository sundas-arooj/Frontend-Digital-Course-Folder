import { Component, OnInit } from '@angular/core';
import { Global } from '../Global';
import { EmailService } from '../Services/email.service';
import { Courses } from '../Models/Courses';
import { Progress, Dates, ChartData } from '../Models/Progress'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  coursess : Courses[];
  path : String[]=[];
  dir : String;
  fileProgess : Progress[]=[];
  chartData : ChartData[]=[];
  quizPerc: number =0;
  assinPerc: number=0;
  lectPerc: number=0;
  midPerc: number=0;
  finalPerc: number=0;
  class : String;
  temp : string[];
  payload : any;


  constructor(
    public gl: Global,
    private emailservice:EmailService
  ) {
   }

  ngOnInit(): void {
    var UserName;
    var Name;
    Name = this.emailservice.getName();
    UserName = this.emailservice.getUserName()
    if(UserName == null)
    {
      this.payload = this.emailservice.getUserPayload();
      UserName = this.payload.Username;
      Name = this.payload.Name;
    }
    this.emailservice.getUserCourses(UserName).subscribe( (courses : Courses[]) =>{
      this.coursess = courses;
      if( courses!= null ){
        console.log(courses)
        var size=0;
        courses.forEach((course)=>{
          size=size+course.Classes.length;
        });

        // var tmp : ChartData={
        //   "Class":"",
        //   "Percentage":[0,0,0,0,0]
        // };

        // for(let i=0; i<size;i++)
        // {
        //   this.chartData.push(tmp);
        // }
        
        
        courses.forEach((val,index)=>{

          var coursePath=this.emailservice.getSemester()+'/'+Name+'/'+val.CourseName+'/';
          val.Classes.forEach((value)=>{
            var temp : Progress={
              "Class":value,
              "Course":val.CourseName,
              "CreditHrs" : val.CreditHrs,
              "Folder":"Quizes",
              "Files":0
            };
            this.fileProgess.push(temp);
            this.dir=coursePath+value+'/'+'Quizes';
            this.path.push(this.dir);
            
              var temp1 : Progress={
              "Class":value,
              "Course":val.CourseName,
              "CreditHrs" : val.CreditHrs,
              "Folder":"Assignments",
              "Files":0
            };
            this.fileProgess.push(temp1);
            this.dir=coursePath+value+'/'+'Assignments';
            this.path.push(this.dir);

            var temp2 : Progress={
              "Class":value,
              "Course":val.CourseName,
              "CreditHrs" : val.CreditHrs,
              "Folder":"Lectures",
              "Files":0
            };
            this.fileProgess.push(temp2);
            this.dir=coursePath+value+'/'+'Lectures';
            this.path.push(this.dir);

            var temp3 : Progress={
              "Class":value,
              "Course":val.CourseName,
              "CreditHrs" : val.CreditHrs,
              "Folder":"Mids",
              "Files":0
            };
            this.fileProgess.push(temp3);
            this.dir=coursePath+value+'/'+'Mids/AvgPaper';
            this.path.push(this.dir);
            this.dir=coursePath+value+'/'+'Mids/BestPaper';
            this.path.push(this.dir);
            this.dir=coursePath+value+'/'+'Mids/WorstPaper';
            this.path.push(this.dir);

            var temp4 : Progress={
              "Class":value,
              "Course":val.CourseName,
              "CreditHrs" : val.CreditHrs,
              "Folder":"Finals",
              "Files":0
            };
            this.fileProgess.push(temp4);
            this.dir=coursePath+value+'/'+'Finals/AvgPaper';
            this.path.push(this.dir);
            this.dir=coursePath+value+'/'+'Finals/BestPaper';
            this.path.push(this.dir);
            this.dir=coursePath+value+'/'+'Finals/WorstPaper';
            this.path.push(this.dir);
          });   //inner loop

        });     //outer loop

        //console.log(this.fileProgess);

        this.emailservice.sendPath(this.path).subscribe((fileNumbr : Number[])=>{
          //console.log(fileNumbr);
          var i=0;
          this.fileProgess.forEach((obj,index)=>{
            if(obj.Folder=="Mids" || obj.Folder=="Finals")
            {
              obj.Files=+fileNumbr[i] + +fileNumbr[i+1] + +fileNumbr[i+2];
              i=i+3;
            }
            else
            {
              obj.Files=fileNumbr[i];
              i=i+1;
            } 
            //console.log(index + " progress "+ obj.Files); 
          });
        }); 
        console.log(this.fileProgess);
        this.cal_Percentage();
      }
      else {
        console.log("Unable to get courses");
      }
    });
  }

  //Calculating Percentage

  cal_Percentage()
  {
    this.chartData = [];
    //console.log("in function ");
    this.emailservice.getDates().subscribe((dates : Dates)=>{
     // console.log(dates);
      //var c_index=0;
      this.fileProgess.forEach((obj,index)=>{
        
        // console.log("in for each loop");
        // console.log("inside loop "+dates);
        var crrDate=new Date();
        //console.log(crrDate);
        //console.log(dates.Quizes[0]);

        if(obj.Folder=="Quizes")
        {
          //this.chartData[c_index].Class=obj.Class;
          var i=0;
          var date;
          this.temp=(dates.Quizes[i]).split('/')
          date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
          while(crrDate.getTime()>new Date(date).getTime() && i<4)
          {
            if(obj.Files!=i+1 && obj.Files < i+1)
            {
              this.quizPerc=+this.quizPerc + +25;
              //this.chartData[c_index].Percentage[0]=+this.chartData[c_index].Percentage[0]+ +25;
            }
            i=i+1;
            if(i<4){
              this.temp=(dates.Quizes[i]).split('/')
              date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
            }       
          }
          this.quizPerc = Math.round(this.quizPerc);
        }

        if(obj.Folder=="Assignments")
        {
          var i=0;
          var date;
          this.temp=(dates.Assignments[i]).split('/')
          date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
          while(crrDate.getTime()>new Date(date).getTime() && i<4)
          {
            if(obj.Files!=i+1 && obj.Files < i+1)
            {
              this.assinPerc=+this.assinPerc + +25;
              //his.chartData[c_index].Percentage[1]=+this.chartData[c_index].Percentage[1]+ +25;
            }
            i=i+1;
            if(i<4){
              this.temp=(dates.Assignments[i]).split('/')
              date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
            } 
          }
          this.assinPerc = Math.round(this.assinPerc);
          //c_index=c_index+1;
          //var class = String; 
        }

        if(obj.Folder=="Lectures")
        {
          var i=0;
          var num=0;
          if(dates.Lectures.length!=0)
          {
            var add_perc=100/(dates.Lectures.length*obj.CreditHrs);
            console.log(add_perc);
            var date;
            this.temp=(dates.Lectures[i]).split('/')
            date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
            while(crrDate.getTime()>new Date(date).getTime() && i< dates.Lectures.length)
            {
              if(obj.Files!=num+obj.CreditHrs && obj.Files < num+obj.CreditHrs)
              {
                //this.chartData[c_index].Percentage[2]=+this.chartData[c_index].Percentage[2]+ +25;
                this.lectPerc=+this.lectPerc + +add_perc;
                if(obj.Files!=num+(obj.CreditHrs-1) && (obj.CreditHrs==2 || obj.CreditHrs>1))
                {
                  this.lectPerc=+this.lectPerc + +add_perc;
                  if(obj.Files!=num+(obj.CreditHrs-2) && obj.CreditHrs>2)
                  {
                    this.lectPerc=+this.lectPerc + +add_perc;
                  }     
                } 
              }
              i=i+1;
              num=num+obj.CreditHrs; 
              if(i< dates.Lectures.length){
                this.temp=(dates.Lectures[i]).split('/')
                date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
              }
            }
            this.lectPerc = Math.round(this.lectPerc);            
            console.log("Lecture:" + this.lectPerc);
          }          
        }

        if(obj.Folder=="Mids")
        {
          var i=0;
          var next=new Date();
          var date;
          this.temp=(dates.midsPaper).split('/')
          date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
          next.setMonth(new Date(date).getMonth());
          next.setFullYear(new Date(date).getFullYear());
          next.setDate(new Date(date).getDate()+14);

          //console.log("mids increment date :" +next);
          if(crrDate.getTime()>next.getTime())
          {
            if(obj.Files!=3 && obj.Files < 3)
              {
                //this.chartData[c_index].Percentage[2]=+this.chartData[c_index].Percentage[2]+ +25;
                this.midPerc=+this.midPerc + +33.3;
                if(obj.Files!=2)
                {
                  this.midPerc=+this.midPerc + +33.3;
                  if(obj.Files!=1)
                  {
                    this.midPerc=+this.midPerc + +33.3;
                  }     
                } 
              }
              this.midPerc = Math.round(this.midPerc);
          }
        }

        if(obj.Folder=="Finals")
        {
          var i=0;

          var next=new Date();
          var date;
          this.temp=(dates.finalsPaper).split('/')
          date = this.temp[1] +'/'+this.temp[0]+'/'+this.temp[2];
          next.setMonth(new Date(date).getMonth());
          next.setFullYear(new Date(date).getFullYear());
          next.setDate(new Date(date).getDate()+14);

          if(crrDate.getTime()>next.getTime())
          {
            if(obj.Files!=3 && obj.Files < 3)
            {
              //this.chartData[c_index].Percentage[2]=+this.chartData[c_index].Percentage[2]+ +25;
              this.finalPerc=+this.finalPerc + +33.3;
              if(obj.Files!=2)
              {
                this.finalPerc=+this.finalPerc + +33.3;
                if(obj.Files!=1)
                {
                  this.finalPerc=+this.finalPerc + +33.3;
                }     
              } 
            }
            this.finalPerc = Math.round(this.finalPerc);
          }

          var tmpObj : ChartData={
            "Class": obj.Class,
            "Percentage":[this.quizPerc,this.assinPerc, this.lectPerc, this.midPerc, this.finalPerc]
          };

          this.chartData.push(tmpObj);
          this.quizPerc=0;
          this.assinPerc=0;
          this.lectPerc=0;
          this.midPerc=0;
          this.finalPerc=0;
        }
      });
      console.log(this.chartData);
      this.chartDatasets = [];
      this.chartColors = [];
      //adding data in chart
    this.chartData.forEach((c_data)=>{
      this.chartDatasets.push({'data': c_data.Percentage ,'label': c_data.Class});
      this.chartColors.push({
        // colors : [
        //     { // 1st Year.
        //       backgroundColor: 'rgba(255, 99, 132, 0.2)'
        //     },
        //     { // 2nd Year.
        //       backgroundColor: 'rgba(54, 162, 235, 0.2)'
        //     }
        // ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2,
      });
    });
    });
  }
  public chartType: string = 'bar';
  public chartDatasets: Array<any> = [];
  public chartLabels: Array<any> = ['Quizes', 'Assignments', 'Lectures', 'Mids', 'Finals'];
  public chartColors: Array<any> = [];
  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
