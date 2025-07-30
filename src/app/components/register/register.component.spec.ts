import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';
import { Observable, of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideHttpClient(), provideRouter([]), { provide: AuthService, useValue: mockAuthService }, { provide: Router, useValue: mockRouter }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registerForm with five controls', () => {
    expect(component.registerForm.contains('name')).toBeTrue();
    expect(component.registerForm.contains('username')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('role')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
  });

  it('should require all fields to be filled', () => {
    const nameControl = component.registerForm.get('name');
    const usernameControl = component.registerForm.get('username');
    const emailControl = component.registerForm.get('email');
    const roleControl = component.registerForm.get('role');
    const passwordControl = component.registerForm.get('password');

    nameControl?.setValue('');
    usernameControl?.setValue('');
    emailControl?.setValue('');
    roleControl?.setValue('');
    passwordControl?.setValue('');

    expect(nameControl?.valid).toBeFalse();
    expect(usernameControl?.valid).toBeFalse();
    expect(emailControl?.valid).toBeFalse();
    expect(roleControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();
    expect(component.registerForm.valid).toBeFalse();

    nameControl?.setValue('John Doe');
    usernameControl?.setValue('johndoe');
    emailControl?.setValue('john@gmail.com');
    roleControl?.setValue('customer');
    passwordControl?.setValue('password123');

    expect(nameControl?.valid).toBeTrue();
    expect(usernameControl?.valid).toBeTrue();
    expect(emailControl?.valid).toBeTrue();
    expect(roleControl?.valid).toBeTrue();
    expect(passwordControl?.valid).toBeTrue();
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should call authService.register on form submission with valid data', () => {
    const mockFormValue = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      role: 'customer',
      password: 'password123'
    };

    component.registerForm.setValue(mockFormValue);

    // Mock the register method to return an observable
    mockAuthService.register.and.returnValue(of({ id: 1, ...mockFormValue } as Account));

    // Spy on alert
    spyOn(window, 'alert');

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(mockFormValue);
    expect(window.alert).toHaveBeenCalledWith('Account Registered Successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should handle registration error', () => {
    const mockFormValue = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      role: 'customer',
      password: 'password123'
    };
    component.registerForm.setValue(mockFormValue);

    mockAuthService.register.and.returnValue(throwError(() => new Error('Registration failed')));
    spyOn(window, 'alert');
    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith(mockFormValue);
    expect(window.alert).toHaveBeenCalledWith('Something went wrong. Please try again later.');
    expect(component.registerFailed).toBeTrue();
  });

  it('should set registerFailed to true if form is invalid', () => {
    spyOn(window, 'alert');
    const mockFormValue = {
      name: 'invalid',
      username: 'invaliduser',
      email: 'invalidemail',
      role: 'invalidrole',
      password: 'invalidpassword'
    };
    component.registerForm.setValue(mockFormValue);
    component.onSubmit();
    expect(component.registerForm.valid).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Please fill out all required fields correctly.');
    expect(component.registerFailed).toBeTrue();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });
});
