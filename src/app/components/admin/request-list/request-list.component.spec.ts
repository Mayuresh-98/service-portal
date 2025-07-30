import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestListComponent } from './request-list.component';
import { RequestService } from '../../../services/request.service';
import { of } from 'rxjs';
import { ServiceRequest } from '../../../models/request.model';
import { CommonModule } from '@angular/common';

describe('RequestListComponent', () => {
  let component: RequestListComponent;
  let fixture: ComponentFixture<RequestListComponent>;
  let mockRequestService: jasmine.SpyObj<RequestService>;

  const mockRequests: ServiceRequest[] = [
    {
      id: 1,
      name: 'Test Request',
      username: 'testuser',
      email: 'test@example.com',
      product: 'Laptop',
      urgency: 'High',
      description: 'Battery issue',
      status: 'pending',
      assignedTo: undefined
    }
  ];

  const mockTechnicians = [
    { id: 1, name: 'Tech One', role: 'technician' },
    { id: 2, name: 'Tech Two', role: 'technician' }
  ];

  beforeEach(async () => {
    mockRequestService = jasmine.createSpyObj('RequestService', [
      'getAllRequests',
      'getTechnicians',
      'assignTechnician'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RequestListComponent],
      //declarations: [RequestListComponent],
      providers: [
        { provide: RequestService, useValue: mockRequestService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListComponent);
    component = fixture.componentInstance;

    // Set up default return values before ngOnInit is triggered
    mockRequestService.getAllRequests.and.returnValue(of(mockRequests));
    mockRequestService.getTechnicians.and.returnValue(of(mockTechnicians));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests and technicians on loadData()', () => {
    component.loadData();

    expect(mockRequestService.getAllRequests).toHaveBeenCalled();
    expect(mockRequestService.getTechnicians).toHaveBeenCalled();
    expect(component.requests).toEqual(mockRequests);
    expect(component.technicians).toEqual(['Tech One', 'Tech Two']);
  });

  it('should assign technician and reload data', () => {
    const requestId = 1;
    const technicianName = 'Tech One';

    mockRequestService.assignTechnician.and.returnValue(
      of({ ...mockRequests[0], assignedTo: technicianName, status: 'assigned' })
    );

    spyOn(component, 'loadData').and.callThrough();

    component.assignTechnician(requestId, technicianName);

    expect(mockRequestService.assignTechnician).toHaveBeenCalledWith(requestId, technicianName);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should alert if technician name is not provided', () => {
    spyOn(window, 'alert');
    component.assignTechnician(1, '');
    expect(window.alert).toHaveBeenCalledWith('Please select a technician.');
  });
});
