import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEvent } from '../Models/UserEvent';
import { EmailService } from './email.service';

@Injectable({
    providedIn: 'root'
})
export class UserEventService {

    uri = 'http://localhost:4000/AUfolder';

    constructor(
        private http: HttpClient,
        private emailService: EmailService) { }

    addUserEvent(userEvent: UserEvent) {
        var obj={ 
            "title": userEvent.title, 
            "date": userEvent.date, 
            "Username":  this.emailService.getUserPayload().Username}
        return this.http.post(`${this.uri}/events`, obj);
    }

    getEvents(){
        return this.http.get(`${this.uri}/getEvents`);
    }
    // getUsers(): Observable<any> {
    //     return this.http.get(`uri`);
    // }

}