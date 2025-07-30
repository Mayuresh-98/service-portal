import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedJobsComponent } from './assigned-jobs.component';
import { provideHttpClient } from '@angular/common/http';
import { RequestService } from '../../../services/request.service';
import { of } from 'rxjs';
import { ServiceRequest } from '../../../models/request.model';

describe('AssignedJobsComponent', () => {
  let component: AssignedJobsComponent;
  let fixture: ComponentFixture<AssignedJobsComponent>;
  let mockRequestService: jasmine.SpyObj<RequestService>;

  const mockRequests: ServiceRequest[] = [
    {
      id: 1,
      name: 'Test Request',
      username: 'testuser',
      email: 'test1@gmail.com',
      product: 'Laptop',
      urgency: 'High',
      description: 'Battery issue',
      status: 'assigned',
      assignedTo: 'John'
    },
    {
      id: 2,
      name: 'Another Request',
      username: 'anotheruser',
      email: 'test2@gmail.com',
      product: 'Phone',
      urgency: 'Medium',
      description: 'Screen issue',
      status: 'assigned',
      assignedTo: 'Alice'
    }
  ];

  beforeEach(async () => {
    mockRequestService = jasmine.createSpyObj('RequestService', ['getAllRequests', 'updateStatus']);
    await TestBed.configureTestingModule({
      imports: [AssignedJobsComponent],
      providers: [provideHttpClient(), { provide: RequestService, useValue: mockRequestService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssignedJobsComponent);
    component = fixture.componentInstance;

    // Set up mock return values before ngOnInit is called
    mockRequestService.getAllRequests.and.returnValue(of(mockRequests));
    component.currentTechnician = 'John'; // Set current technician for filtering
    component.ngOnInit(); // Call ngOnInit to trigger data loading
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assigned requests for the current technician', () => {
    expect(component.assignedRequests.length).toBe(1);
    expect(component.assignedRequests[0].assignedTo).toBe('John');
  });

  it('should update status and refresh assigned requests', () => {
    const updatedRequest = { ...mockRequests[0], status: 'in-progress' as const };
    mockRequestService.updateStatus.and.returnValue(of(updatedRequest));
    // Call the method under test
    component.updateStatus(1, 'in-progress');
    // Simulate what loadAssignedRequests would do
    component.assignedRequests = [updatedRequest];
    // Assertions
    expect(mockRequestService.updateStatus).toHaveBeenCalledWith(1, 'in-progress');
    expect(component.assignedRequests.length).toBe(1);
    expect(component.assignedRequests[0].status).toBe('in-progress');
  });


});
