import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRequestComponent } from './submit-request.component';
import { provideHttpClient } from '@angular/common/http';
import { RequestService } from '../../../services/request.service';
import { of, throwError } from 'rxjs';

describe('SubmitRequestComponent', () => {
  let component: SubmitRequestComponent;
  let fixture: ComponentFixture<SubmitRequestComponent>;
  let mockRequestService: jasmine.SpyObj<RequestService>;


  beforeEach(async () => {
    mockRequestService = jasmine.createSpyObj('RequestService', ['addRequest']);
    await TestBed.configureTestingModule({
      imports: [SubmitRequestComponent],
      providers: [provideHttpClient(),
      { provide: RequestService, useValue: mockRequestService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubmitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize requestForm with six controls', () => {
    expect(component.requestForm.contains('name')).toBeTrue();
    expect(component.requestForm.contains('email')).toBeTrue();
    expect(component.requestForm.contains('username')).toBeTrue();
    expect(component.requestForm.contains('product')).toBeTrue();
    expect(component.requestForm.contains('urgency')).toBeTrue();
    expect(component.requestForm.contains('description')).toBeTrue();
  });

  it('should require all fields to be filled', () => {
    const nameControl = component.requestForm.get('name');
    const emailControl = component.requestForm.get('email');
    const usernameControl = component.requestForm.get('username');
    const productControl = component.requestForm.get('product');
    const urgencyControl = component.requestForm.get('urgency');
    const descriptionControl = component.requestForm.get('description');

    nameControl?.setValue('');
    emailControl?.setValue('');
    usernameControl?.setValue('');
    productControl?.setValue('');
    urgencyControl?.setValue('');
    descriptionControl?.setValue('');

    expect(nameControl?.valid).toBeFalse();
    expect(emailControl?.valid).toBeFalse();
    expect(usernameControl?.valid).toBeFalse();
    expect(productControl?.valid).toBeFalse();
    expect(urgencyControl?.valid).toBeFalse();
    expect(descriptionControl?.valid).toBeFalse();
    expect(component.requestForm.valid).toBeFalse();
  });

  it('should submit the form when valid', () => {
    const mockFormValue = {
      name: 'John',
      email: 'john@gmail.com',
      username: 'john',
      product: 'Laptop',
      urgency: 'medium',
      description: 'Need help with my laptop.'
    };
    component.requestForm.setValue(mockFormValue);
    mockRequestService.addRequest.and.returnValue(of({ id: 1, status: 'pending' as const, ...mockFormValue }));
    spyOn(window, 'alert');
    component.onSubmit();
    expect(mockRequestService.addRequest).toHaveBeenCalledWith(mockFormValue);
    expect(window.alert).toHaveBeenCalledWith('Request submitted successfully!');
    expect(component.requestForm.value).toEqual({
      name: null,
      email: null,
      username: null,
      product: null,
      urgency: 'medium',
      description: null
    });
  });

  it('should not submit the form when invalid', () => {
    const mockFormValue = {
      name: '',
      email: 'invalid-email',
      username: '',
      product: '',
      urgency: 'medium',
      description: ''
    };
    component.requestForm.setValue(mockFormValue);
    spyOn(window, 'alert');
    component.onSubmit();
    expect(mockRequestService.addRequest).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please fill out all required fields correctly.');
  });

  it('should handle submission error', () => {
    const mockFormValue = {
      name: 'John',
      email: 'john@gmail.com',
      username: 'john',
      product: 'Laptop',
      urgency: 'medium',
      description: 'Need help with my laptop.'
    };
    component.requestForm.setValue(mockFormValue);
    mockRequestService.addRequest.and.returnValue(throwError(() => new Error('Submission failed')));
    spyOn(window, 'alert');
    component.onSubmit();
    expect(mockRequestService.addRequest).toHaveBeenCalledWith(mockFormValue);
    expect(window.alert).toHaveBeenCalledWith('Something went wrong. Please try again later.');
  });
});
