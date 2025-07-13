import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'customer' },
    { username: 'tech-alice', password: 'alice123', role: 'technician', name: 'Alice' },
    { username: 'tech-bob', password: 'bob123', role: 'technician', name: 'Bob' },
  ];

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if(user) {
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      if (user.role === 'technician' && user.name) {
        localStorage.setItem('technicianName', user.name);
      }
      return true;
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('role');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}
