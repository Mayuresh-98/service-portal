import { Injectable } from '@angular/core';
import { ServiceRequest } from '../models/request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Add Request
  addRequest(data: Omit<ServiceRequest, 'id' | 'status'>): Observable<ServiceRequest> {
    const request = {
      ...data,
      status: 'pending', // Default status
    };
    return this.http.post<ServiceRequest>(`${this.baseUrl}/requests`, request);
  }

  // Get All Requests
  getAllRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.baseUrl}/requests`);
  }

  // Assign Technician
  assignTechnician(id: number, technicianName: string): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.baseUrl}/requests/${id}`, { assignedTo: technicianName, status: 'assigned' });
  }

  // Update Status
  updateStatus(id: number, status: ServiceRequest['status']): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.baseUrl}/requests/${id}`, { status });
  }

  // Get Technicians
  getTechnicians(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.baseUrl}/technicians`);
  }
}
