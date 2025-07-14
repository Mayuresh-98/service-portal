import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.loadUsers();
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    const success = this.authService.login(username, password);
    if (success) {
      this.loginFailed = false;
      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/admin/request-list']);
      } else if (role === 'technician') {
        this.router.navigate(['/technician/assigned-jobs']);
      } else {
        this.router.navigate(['/user/submit-request']);
      }
    } else {
      this.loginFailed = true;
    }
  }

  register(){
    this.router.navigate(['register']);
  }
}
