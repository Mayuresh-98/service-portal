import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceRequest } from '../../../models/request.model';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-assigned-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-jobs.component.html',
  styleUrls: ['./assigned-jobs.component.css']
})
export class AssignedJobsComponent {
  assignedRequests: ServiceRequest[] = [];
  currentTechnician: string = localStorage.getItem('technicianName') || '';

  constructor(private requestService: RequestService) {}

  ngOnInit() : void {
    this.loadAssignedRequests();
  }

  loadAssignedRequests() {
    this.requestService.getAllRequests().subscribe(requests => {
      this.assignedRequests = requests.filter(req => req.assignedTo === this.currentTechnician);
    });
  }

  updateStatus(id: number, status: ServiceRequest['status']) {
    this.requestService.updateStatus(id, status).subscribe(() => {
      this.loadAssignedRequests(); // Refresh list after update
    });
  }
}
