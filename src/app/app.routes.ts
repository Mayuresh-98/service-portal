import { Routes } from '@angular/router';
import { SubmitRequestComponent } from './components/user/submit-request/submit-request.component';
import { RequestStatusComponent } from './components/user/request-status/request-status.component';
import { roleGuard } from './guards/role.guard';
import { AssignTechnicianComponent } from './components/admin/assign-technician/assign-technician.component';
import { RequestListComponent } from './components/admin/request-list/request-list.component';
import { AssignedJobsComponent } from './components/technician/assigned-jobs/assigned-jobs.component';
import { UpdateStatusComponent } from './components/technician/update-status/update-status.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { HomePageComponent } from './components/shared/home-page/home-page.component';

export const routes: Routes = [
    { 
        path: '', redirectTo: '/home', pathMatch: 'full'
    },
    {
        path: 'home', component: HomePageComponent
    },
    { 
        path: 'login', component: LoginComponent 
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'user/submit-request', component: SubmitRequestComponent, canActivate: [authGuard, roleGuard], data: { roles: ['customer'] }
    },
    {
        path: 'user/request-status', component: RequestStatusComponent, canActivate: [authGuard, roleGuard], data: { roles: ['customer'] }
    },
    {
        path: 'admin/request-list', component: RequestListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }
    },
    {
        path: 'admin/assign-technician', component: AssignTechnicianComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }
    },
    {
        path: 'technician/assigned-jobs', component: AssignedJobsComponent, canActivate: [authGuard, roleGuard ], data: { roles: ['technician'] }
    },
    {
        path: 'technician/update-status', component: UpdateStatusComponent, canActivate: [authGuard, roleGuard], data: { roles: ['technician'] }
    },
    {
        path: '**', component: NotFoundComponent
    }
];
