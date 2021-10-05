import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseRegistrationComponent } from './course-registration/course-registration.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { HomeComponent } from './home/home.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { ClassFoldersComponent } from './class-folders/class-folders.component';
import { AdminDasboardComponent } from './admin-dasboard/admin-dasboard.component';
import { FacultyManagementComponent } from './faculty-management/faculty-management.component';
import { TaskSchedulerComponent } from './task-scheduler/task-scheduler.component';
import { AuthGuard } from '../app/auth/auth.guard'
import { EditCoursesComponent } from './edit-courses/edit-courses.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';


const routes: Routes = [

  {
    path:'',
    component:LoginComponent
  },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'requestResetPassword',
    component: RequestResetPasswordComponent
  },
  {
    path:'home',
    component:HomeComponent, canActivate: [AuthGuard],
    children : [
      {
        path:'signup',
        component:SignupComponent
      },
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'courseReg',
        component:CourseRegistrationComponent
      },
      {
        path: 'fileManager',
        component : FileManagerComponent
      },
      {
        path: 'courseManag',
        component : CourseManagementComponent
      },
      {
        path: 'classFolders',
        component : ClassFoldersComponent
      },
      {
        path: 'adminDashboard',
        component : AdminDasboardComponent
      },
      {
        path: 'facutlyManage',
        component : FacultyManagementComponent
      },
      {
        path: 'TaskScheduler',
        component: TaskSchedulerComponent
      },
      {
        path: 'edit/:username',
        component: EditCoursesComponent
      },
      {
        path: 'ChangePassword',
        component: PasswordChangeComponent
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
