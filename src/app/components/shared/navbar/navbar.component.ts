import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  role: string | null = localStorage.getItem('role') || 'Not selected';

  setRole(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;

    if (selected === 'technician') {
      const techName = prompt('Enter technician name (e.g. Alice, Bob):');
      if (techName) {
        localStorage.setItem('role', 'technician');
        localStorage.setItem('technicianName', techName);
      }
    } else {
      localStorage.setItem('role', selected);
      localStorage.removeItem('technicianName');
    }

    this.role = selected;
  }

}
