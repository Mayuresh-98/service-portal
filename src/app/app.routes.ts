import { Routes } from '@angular/router';
import { SubmitRequestComponent } from './components/user/submit-request/submit-request.component';
import { RequestStatusComponent } from './components/user/request-status/request-status.component';
import { roleGuard } from './guards/role.guard';
import { AssignTechnicianComponent } from './components/admin/assign-technician/assign-technician.component';
import { RequestListComponent } from './components/admin/request-list/request-list.component';
import { AssignedJobsComponent } from './components/technician/assigned-jobs/assigned-jobs.component';
import { UpdateStatusComponent } from './components/technician/update-status/update-status.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '', redirectTo: '/user/submit-request', pathMatch: 'full'
    },
    {
        path:'user/submit-request', component: SubmitRequestComponent
    },
    {
        path:'user/request-status', component: RequestStatusComponent
    },
    {
        path:'admin/request-list', component: RequestListComponent, canActivate:[roleGuard], data: { roles: ['admin'] }
    },
    {
        path:'admin/assign-technician', component: AssignTechnicianComponent, canActivate:[roleGuard], data: { roles: ['admin'] }
    },
    {
        path:'technician/assigned-jobs', component: AssignedJobsComponent, canActivate:[roleGuard], data: { roles: ['technician'] }
    },
    {
        path:'technician/update-status', component: UpdateStatusComponent, canActivate:[roleGuard], data: { roles: ['technician'] }
    },
    {
        path:'**', component: NotFoundComponent
    }
];
