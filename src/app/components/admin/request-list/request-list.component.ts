import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceRequest } from '../../../models/request.model';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent {
  requests: ServiceRequest[] = [];
  technicians: string[] = [];
  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.requestService.getAllRequests().subscribe((data) => {
      this.requests = data;
    });

    this.requestService.getTechnicians().subscribe((techs) => {
      this.technicians = techs.map(t => t.name);
    });
  }

  assignTechnician(requestId: number, technicianName: string): void {
    if(!technicianName) {
      alert('Please select a technician.');
      return;
    }
    this.requestService.assignTechnician(requestId, technicianName).subscribe(() => {
      this.loadData(); // Refresh the request list after assignment
    });
  }
}
