import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  role: string | null = localStorage.getItem('role') || 'Not selected';

  setRole(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;
    localStorage.setItem('role', selectedRole);
    this.role = selectedRole;
    //console.log(`Role set to: ${role}`);
  }
}
