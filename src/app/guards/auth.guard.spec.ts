import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);
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
  it('should allow access if user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    const result = executeGuard(null as any, null as any);
    expect(result).toBeTrue();
  });
  it('should redirect to login if user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    const urlTree = {} as UrlTree;
    mockRouter.createUrlTree.and.returnValue(urlTree);
    const result = executeGuard(null as any, null as any);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(urlTree);
  });
});
