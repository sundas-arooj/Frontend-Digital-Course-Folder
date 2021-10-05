import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavbarService } from './Services/navbar.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailService } from './Services/email.service';
import { Global } from './Global';
import { from } from 'rxjs';
import { CourseRegistrationComponent } from './course-registration/course-registration.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { HomeComponent } from './home/home.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { ClassFoldersComponent } from './class-folders/class-folders.component';
import { AdminDasboardComponent } from './admin-dasboard/admin-dasboard.component';
import { FacultyManagementComponent } from './faculty-management/faculty-management.component';
import { TaskSchedulerComponent } from './task-scheduler/task-scheduler.component';
import { AuthGuard } from '../app/auth/auth.guard'
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoadProgressComponent } from './load-progress/load-progress.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCoursesComponent } from './edit-courses/edit-courses.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    CourseRegistrationComponent,
    FileManagerComponent,
    HomeComponent,
    CourseManagementComponent,
    ClassFoldersComponent,
    AdminDasboardComponent,
    FacultyManagementComponent,
    TaskSchedulerComponent,
    LoadProgressComponent,
    EditCoursesComponent,
    PasswordChangeComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule,
    FullCalendarModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, NavbarService, EmailService, Global,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
