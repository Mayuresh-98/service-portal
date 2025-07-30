import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  get role(): string | null {
  return this.authService.getRole();
  }

  get name(): string | null {
    return this.authService.getName();
  }

  // setRole(event: Event) {
  //   const selected = (event.target as HTMLSelectElement).value;

  //   if (selected === 'technician') {
  //     const techName = prompt('Enter technician name (e.g. Alice, Bob):');
  //     if (techName) {
  //       localStorage.setItem('role', 'technician');
  //       localStorage.setItem('technicianName', techName);
  //     }
  //   } else {
  //     localStorage.setItem('role', selected);
  //     localStorage.removeItem('technicianName');
  //   }
  // }
  
  currentPage(): string {
    return this.router.url;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
