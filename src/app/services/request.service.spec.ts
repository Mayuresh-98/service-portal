import { TestBed } from '@angular/core/testing';

import { RequestService } from './request.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ServiceRequest } from '../models/request.model';
import { of } from 'rxjs';

describe('RequestService', () => {
  let service: RequestService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  const mockRequests: ServiceRequest[] = [
    {
      id: 1,
      name: 'Test Request',
      username: 'anothertestuser',
      email: 'test@example.com',
      product: 'Laptop',
      urgency: 'High',
      description: 'Battery issue',
      status: 'pending'
    }
    , {
      id: 2,
      name: 'Another Request',
      username: 'testuser',
      email: 'test@example.com',
      product: 'Phone',
      urgency: 'Low',
      description: 'Screen cracked',
      status: 'in-progress',
      assignedTo: 'tech-alice'
    }
  ];

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch']);
    mockHttpClient.get.and.returnValue(of(mockRequests)); // Mock the HTTP GET request

    mockHttpClient.post.and.callFake((url: string, request: any) => {
      const newRequest = { ...request, id: mockRequests.length + 1, status: 'pending' };
      mockRequests.push(newRequest); // Simulate backend update
      return of(newRequest); // Return observable of new request
    });

    // Mock the HTTP PATCH request for assigning technician and updating status (needs to be studied)
    (mockHttpClient.patch as jasmine.Spy).and.callFake((url: string, update: any, options?: any) => {
      const id = parseInt(url.split('/').pop() || '', 10);
      const request = mockRequests.find(req => req.id === id);
      if (request) {
        Object.assign(request, update);
        return of({ ...request });
      }
      return of(null);
    });

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpClient, useValue: mockHttpClient }]
    });
    service = TestBed.inject(RequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a request', () => {
    const newRequest: Omit<ServiceRequest, 'id' | 'status'> = {
      name: 'Another Request',
      username: 'testuser',
      email: 'test@example.com',
      product: 'Phone',
      urgency: 'Low',
      description: 'Screen cracked'
    };
    service.addRequest(newRequest).subscribe(request => {
      expect(request).toEqual({ ...newRequest, id: 3, status: 'pending' });
      expect(mockRequests.length).toBe(3);
    });
  });

  it('should get all requests', () => {
    service.getAllRequests().subscribe(requests => {
      expect(requests).toEqual(mockRequests);
    });
  });

  it('should assign a technician', () => {
    const technicianName = 'tech-alice';
    service.assignTechnician(1, technicianName).subscribe(request => {
      expect(request.assignedTo).toBe(technicianName);
      expect(request.status).toBe('assigned');
    });
  });

  it('should update request status', () => {
    const newStatus: ServiceRequest['status'] = 'resolved';
    service.updateStatus(2, newStatus).subscribe(request => {
      expect(request.status).toBe(newStatus);
    });
  });

  it('should get technicians', () => {
    const mockTechnicians = [
      { id: 3, name: 'Alice', role: 'technician' },
      { id: 4, name: 'Bob', role: 'technician' }
    ];
    mockHttpClient.get.and.returnValue(of(mockTechnicians));

    service.getTechnicians().subscribe(technicians => {
      expect(technicians.length).toBe(2);
      expect(technicians[0].name).toBe('Alice');
      expect(technicians[1].name).toBe('Bob');
    });
  });

});
