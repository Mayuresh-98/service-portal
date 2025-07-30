import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Account } from '../../models/account.model';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  const mockUsers: Account[] = [
    { id: 1, email: 'admin@gmail.com', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
    { id: 2, email: 'user@gmail.com', username: 'user', password: 'user123', role: 'customer', name: 'User' },
    { id: 3, email: 'alice@gmail.com', username: 'tech-alice', password: 'alice123', role: 'technician', name: 'Alice' }]

beforeEach(async () => {
  mockAuthService = jasmine.createSpyObj('AuthService', ['loadUsers', 'login', 'getRole']);

  // Set up mock return values BEFORE component creation
  mockAuthService.loadUsers.and.callFake(() => {
    (mockAuthService as any).users = mockUsers; // simulate internal assignment
  });

  await TestBed.configureTestingModule({
    imports: [LoginComponent],
    providers: [
      provideHttpClient(),
      { provide: AuthService, useValue: mockAuthService },
      { provide: Router, useValue: mockRouter }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(LoginComponent);
  component = fixture.componentInstance;

  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with two controls', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should require username and password', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    usernameControl?.setValue('');
    passwordControl?.setValue('');
    expect(usernameControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();

    usernameControl?.setValue('testuser');
    passwordControl?.setValue('testpass');
    expect(usernameControl?.valid).toBeTrue();
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should call loadUsers on ngOnInit', () => {
    component.ngOnInit();
    expect(mockAuthService.loadUsers).toHaveBeenCalled();
  });

  it('should login successfully with valid credentials', () => {
    const username = 'admin';
    const password = 'admin123';
    mockAuthService.login.and.returnValue(true);
    mockAuthService.getRole.and.returnValue('admin');
    component.loginForm.setValue({ username, password });
    component.onLogin();
    expect(component.loginFailed).toBeFalse();
    expect(mockAuthService.login).toHaveBeenCalledWith(username, password);
    expect(mockAuthService.getRole).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/request-list']);
  });

  it('should login successfully with valid credentials', () => {
    const username = 'user';
    const password = 'user123';
    mockAuthService.login.and.returnValue(true);
    mockAuthService.getRole.and.returnValue('customer');
    component.loginForm.setValue({ username, password });
    component.onLogin();
    expect(component.loginFailed).toBeFalse();
    expect(mockAuthService.login).toHaveBeenCalledWith(username, password);
    expect(mockAuthService.getRole).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/submit-request']);
  });

  it('should login successfully with valid credentials', () => {
    const username = 'tech-alice';
    const password = 'alice123';
    mockAuthService.login.and.returnValue(true);
    mockAuthService.getRole.and.returnValue('technician');
    component.loginForm.setValue({ username, password });
    component.onLogin();
    expect(component.loginFailed).toBeFalse();
    expect(mockAuthService.login).toHaveBeenCalledWith(username, password);
    expect(mockAuthService.getRole).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/technician/assigned-jobs']);
  });

  it('should fail login with invalid credentials', () => {
    const username = 'invaliduser';
    const password = 'invalidpass';
    mockAuthService.login.and.returnValue(false);
    component.loginForm.setValue({ username, password });
    component.onLogin();
    expect(component.loginFailed).toBeTrue();
    expect(mockAuthService.login).toHaveBeenCalledWith(username, password);
    //expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to register page on register()', () => {
    component.register();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register']);
  });  
  
});
