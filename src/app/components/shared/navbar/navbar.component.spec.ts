import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth.service';
import { Account } from '../../../models/account.model';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUsers: Account[] = [
    { id: 1, email: 'admin@gmail.com', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
    { id: 2, email: 'user@gmail.com', username: 'user', password: 'user123', role: 'customer', name: 'User' },
    { id: 3, email: 'alice@gmail.com', username: 'tech-alice', password: 'alice123', role: 'technician', name: 'Alice' }
  ];

  const account: Account = {
    id: 2,
    email: 'user@gmail.com',
    username: 'user',
    password: 'user123',
    role: 'customer',
    name: 'User'
  };


beforeEach(async () => {
  mockAuthService = jasmine.createSpyObj('AuthService', ['logout', 'getRole', 'getName', 'login', 'loadUsers']);

  mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
    url: '/current-page',
    events: of({}),
    routerState: {
      root: {
        snapshot: {}
      }
    }
  });

  const mockActivatedRoute = {
    snapshot: {
      url: [],
      params: {},
      queryParams: {},
      data: {},
      fragment: ''
    }
  };

  mockAuthService.getRole.and.returnValue(account.role);
  mockAuthService.getName.and.returnValue(account.name);
  mockAuthService.logout.and.stub();
  mockAuthService.loadUsers.and.callFake(() => {
    (mockAuthService as any).users = mockUsers;
  });

  
await TestBed.configureTestingModule({
  imports: [NavbarComponent],
  providers: [
    { provide: AuthService, useValue: mockAuthService },
    { provide: ActivatedRoute, useValue: mockActivatedRoute },
    provideHttpClient(),
    provideRouter([]) // ✅ This provides a real Router with no routes
  ]
}).compileComponents();


  fixture = TestBed.createComponent(NavbarComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the role from AuthService', () => {
    expect(component.role).toBe(account.role);
  });

  it('should return the name from AuthService', () => {
    expect(component.name).toBe(account.name);
  });

  it('should call logout and navigate to login on logout', async () => {
  const router = TestBed.inject(Router);
  const navigateSpy = spyOn(router, 'navigate').and.stub();

  component.logout();

  expect(mockAuthService.logout).toHaveBeenCalled();
  expect(navigateSpy).toHaveBeenCalledWith(['/login']);
});


  it('should return the current page URL', () => {
    expect(component.currentPage()).toBe('/');
  });
});
