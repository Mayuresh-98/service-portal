import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRole']);
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access if user has the expected role', () => {
    const expectedRoles = ['admin', 'user'];
    mockAuthService.getRole.and.returnValue('admin');
    const result = executeGuard({ data: { roles: expectedRoles } } as any, null as any);
    expect(result).toBeTrue();
  });

  it('should redirect to home if user does not have the expected role', () => {
    const expectedRoles = ['admin', 'user'];
    mockAuthService.getRole.and.returnValue('guest');
    const urlTree = {} as any;
    mockRouter.parseUrl.and.returnValue(urlTree);
    const result = executeGuard({ data: { roles: expectedRoles } } as any, null as any);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/home');
    expect(result).toEqual(urlTree);
  });

  
it('should allow access if expectedRoles includes fallback ""', () => {
    mockAuthService.getRole.and.returnValue(null); // or null or ''
    const routeMock = { data: { roles: [''] } } as any;
    const stateMock = {} as any;

    const result = TestBed.runInInjectionContext(() => roleGuard(routeMock, stateMock));
    expect(result).toBeTrue();
  });

});
