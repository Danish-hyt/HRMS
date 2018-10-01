import { TimesheetComponent } from './timesheet/timesheet.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: TimesheetComponent },
  // { path: 'register', component: RegistrationComponent, canActivate: [AuthGuardService] },
  // { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
