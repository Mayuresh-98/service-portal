import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusComponent } from './request-status.component';
import { provideHttpClient } from '@angular/common/http';
import { RequestService } from '../../../services/request.service';
import { ServiceRequest } from '../../../models/request.model';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

describe('RequestStatusComponent', () => {
  let component: RequestStatusComponent;
  let fixture: ComponentFixture<RequestStatusComponent>;
  let mockRequestService: jasmine.SpyObj<RequestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const mockRequests: ServiceRequest[] = [
      {
        id: 1,
        name: 'Test Request',
        username: 'anothertestuser',
        email: 'test@example.com',
        product: 'Laptop',
        urgency: 'High',
        description: 'Battery issue',
        status: 'pending',
        assignedTo: undefined
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

  beforeEach(async () => {
    mockRequestService = jasmine.createSpyObj('RequestService', ['getAllRequests']);
    mockRequestService.getAllRequests.and.returnValue(of(mockRequests));
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserName']);
    mockAuthService.getUserName.and.returnValue('testuser');


    await TestBed.configureTestingModule({
      imports: [RequestStatusComponent],
      providers: [provideHttpClient(), { provide: RequestService, useValue: mockRequestService }, { provide: AuthService, useValue: mockAuthService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user requests on init', () => {
    expect(mockRequestService.getAllRequests).toHaveBeenCalled();
    expect(component.userRequests.length).toBe(1); // Only one request matches the username
    expect(component.userRequests[0].name).toBe('Another Request');
    localStorage.clear(); // Clear localStorage after test
  });

  it('should set userName to empty string if AuthService returns null', () => {
  mockAuthService.getUserName.and.returnValue(null); // simulate missing username

  fixture = TestBed.createComponent(RequestStatusComponent);
  component = fixture.componentInstance;
  fixture.detectChanges(); // triggers ngOnInit

  expect(component.userName).toBe('');
  expect(mockRequestService.getAllRequests).toHaveBeenCalled();
});

});
