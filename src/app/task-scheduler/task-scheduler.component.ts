import { Component, OnInit } from '@angular/core';
import { FullCalendarComponent,CalendarOptions } from '@fullcalendar/angular';  
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import { UserEvent } from '../Models/UserEvent';
import { EmailService } from '../Services/email.service';
import { UserEventService } from '../Services/EventService';
// import * as $ from "jquery";
declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.css'],
})
export class TaskSchedulerComponent implements OnInit {
  endDate: any;
  newdate: string = '';
  payload: any;
  title: string;
  startTime: string;
  endTime: string;
  userEvents: UserEvent[]=[];
  //users: String[]=[];
  selectedEvents: UserEvent[] = [];
  userDetails : any[]=[];
  //selectedUser = '';
  eventAdd: Boolean=true;

  constructor(
    private emailService: EmailService,
    private userEventService: UserEventService
  ){
    this.payload = this.emailService.getUserPayload();
  }

  ngOnInit(): void {
    //console.log(JSON.stringify(this.payload));
    this.initEvents();
  }

  initEvents() {
    this.userEventService.getEvents().subscribe((res) => {
      if(res){
        if(Array.isArray(res)){
          this.userDetails=res;
        }
        this.userDetails.forEach((user)=>{
          if(user.UserName==this.payload.Username){
            user.Name="My Schedule"
          }
        })
        if(this.payload.IsAdmin){
          this.eventAdd=false;
        }
        else{
          this.initUser(this.payload.Username);
        }
      }
      else {
        console.log("Error in getting events from Database");
      }
    });
  }

  initUser(username){
    var user = this.userDetails.filter(user => user.UserName==username)
      this.getUserEvents(user);
      //console.log("event source passed: "+username);
      if(username==this.payload.Username){
        this.eventAdd=true;
      }
      else{
        this.eventAdd=false;
      }
    //console.log("selected user from dropdown "+ this.selectedUser);
  }

  //updating calendar options dynamically
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    headerToolbar: {
      // left: 'prev,next today',
      // center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      center: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', //,   addEventButton
      // buttons for switching between views
      end: 'today prev,next'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    aspectRatio:1.5,
    height:'auto',
    contentHeight: 'auto',
    //dateClick: this.handleDateClick.bind(this), // bind is important!
    events: this.selectedEvents,
  };
  // handleDateClick(arg) {
  //   alert('date click! ' + arg.dateStr);
  // }

  getUserEvents(user) {
    user[0].Events.forEach(event=>{
      var event_tmp={"title":"","date":""};
      event_tmp.title=event.title;
      event_tmp.date=event.date;
      this.selectedEvents.push(event_tmp);
    });
    console.log(this.selectedEvents);
  }

  change(event)
  {
    if(event.isUserInput) {
      this.selectedEvents.splice(0,this.selectedEvents.length)
      console.log("selected user : "+event.source.value);
      this.initUser(event.source.value);
    }
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  getDate(date :string){
    this.endDate = new Date(date);
    var month=this.endDate.getMonth()+1; 
    if(month<10){month='0'+month;}
    var day= this.endDate.getDate();
    if(day<10){day='0'+day};
    var year= this.endDate.getFullYear();
    this.newdate=year+'-'+month+'-'+day;
  }

  getTime(time : string){
    console.log("time : "+time);
  }

  getTitle(title: string) {
    this.title = title;
  }

  addEvent() {
    if(this.title=="" || this.newdate == ""){
      alert("Title or Date field is missing");
    }
    else{
      var event = {
        title: this.title,
        date: this.newdate
      };
      this.userEventService.addUserEvent(event).subscribe((res: any) => {
        console.log(JSON.stringify(res));
        this.selectedEvents.push(event);
      });
    }

  }
}
