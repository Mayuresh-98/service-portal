import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { Observable, of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  const mockUsers: Account[] = [
    { id: 1, email: 'admin@gmail.com', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
    { id: 2, email: 'user@gmail.com', username: 'user', password: 'user123', role: 'customer', name: 'User' },
    { id: 3, email: 'alice@gmail.com', username: 'tech-alice', password: 'alice123', role: 'technician', name: 'Alice' }]

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mockHttpClient.get.and.returnValue(of(mockUsers)); // Mock the HTTP GET request

    mockHttpClient.post.and.callFake((url: string, user: any) => {
      mockUsers.push(user); // Simulate backend update
      return of(user);      // Return observable of new user
    });

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpClient, useValue: mockHttpClient }]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users from the server', () => {
    service.loadUsers();
    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3000/accounts');
    expect((service as any).users).toEqual(mockUsers);
  });

  it('should login with valid credentials', () => {
    service.loadUsers(); // Ensure users are loaded before login
    const result = service.login('admin', 'admin123');
    expect(result).toBeTrue();
    expect(localStorage.getItem('role')).toBe('admin');
    expect(localStorage.getItem('username')).toBe('admin');
    expect(localStorage.getItem('name')).toBe('Admin');
    expect(localStorage.getItem('id')).toBe('1');
    expect(localStorage.getItem('email')).toBe('admin@gmail.com');
    localStorage.clear(); // Clear localStorage after test

    const technicianResult = service.login('tech-alice', 'alice123');
    expect(technicianResult).toBeTrue();
    expect(localStorage.getItem('role')).toBe('technician');
    expect(localStorage.getItem('technicianName')).toBe('Alice');
    localStorage.clear(); // Clear localStorage after test
  });

  it('should not login with invalid credentials', () => {
    service.loadUsers(); // Ensure users are loaded before login
    const result = service.login('invalidUser', 'invalidPass');
    expect(result).toBeFalse();
    expect(localStorage.length).toBe(0); // Ensure localStorage is empty
  });

  it('should register new user with given data', () => {
    const newUser: Account = { id: 1, email: 'newuser@gmail.com', username: 'newuser', password: 'newuser123', role: 'customer', name: 'NewUser' };
    service.register(newUser);
    expect(mockHttpClient.post).toHaveBeenCalledWith('http://localhost:3000/accounts', newUser);
    service.loadUsers();
    expect((service as any).users).toHaveSize(4);
    const result = service.login('newuser', 'newuser123');
    expect(result).toBeTrue();
    localStorage.clear(); // Clear localStorage after test
  });

  it('should clear localStorage on logout', () => {
    service.logout();
    expect(localStorage.length).toBe(0);
  });

  it('should check if user is logged in',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      expect(service.isLoggedIn()).toBeFalse();
      service.login('admin', 'admin123');
      expect(service.isLoggedIn()).toBeTrue();
      localStorage.clear(); // Clear localStorage after test
    }));

  it('should get user role from localStorage',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      service.login('admin', 'admin123');
      expect(service.getRole()).toBe('admin');
      localStorage.clear(); // Clear localStorage after test
    }));

  it('should get user email from localStorage',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      service.login('admin', 'admin123');
      expect(service.getEmail()).toBe('admin@gmail.com');
      localStorage.clear(); // Clear localStorage after test
    }));

  it('should return id from localStorage',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      service.login('admin', 'admin123');
      expect(service.getId()).toBe(1);
      localStorage.clear(); // Clear localStorage after test
    }));

  it('should return username from localStorage',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      service.login('admin', 'admin123');
      expect(service.getUserName()).toBe('admin');
      localStorage.clear(); // Clear localStorage after test
    }));

  it('should return name from localStorage',fakeAsync(() => {
      service.loadUsers();
      tick(); // wait for async loadUsers to complete

      service.login('admin', 'admin123');
      expect(service.getName()).toBe('Admin');
      localStorage.clear(); // Clear localStorage after test
    }));

});
