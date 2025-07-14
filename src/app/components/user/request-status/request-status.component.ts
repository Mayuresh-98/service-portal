import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceRequest } from '../../../models/request.model';
import { RequestService } from '../../../services/request.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css'] 
})
export class RequestStatusComponent {
  userRequests: ServiceRequest[] = [];
  userName: string = ''; 

  constructor(private requestService: RequestService, private authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getUserName() || '';
    this.loadUserRequests();
  }

  loadUserRequests() {
    this.requestService.getAllRequests().subscribe((all) => {
      this.userRequests = all.filter(req => req.name === this.userName);
      console.log(this.userRequests);
    });
  }
}
