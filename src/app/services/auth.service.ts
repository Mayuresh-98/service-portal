import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  
  // private users = [
  //   { username: 'admin', password: 'admin123', role: 'admin' },
  //   { username: 'user', password: 'user123', role: 'customer' },
  //   { username: 'tech-alice', password: 'alice123', role: 'technician', name: 'Alice' },
  //   { username: 'tech-bob', password: 'bob123', role: 'technician', name: 'Bob' },
  //   { username: 'tech-charlie', password: 'charlie123', role: 'technician', name: 'charlie' },
  // ];

  private users : Account[] = [];
  
  loadUsers() {
    this.http.get(`${this.baseUrl}/accounts`).subscribe((res : any) =>{
      this.users = res;
      //console.log(this.users);
    })
  }


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

  register (data: Omit<Account, 'id'>): Observable<Account> {
    const account = {
      ...data,
    };
    return this.http.post<Account>(`${this.baseUrl}/accounts`,account);
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
