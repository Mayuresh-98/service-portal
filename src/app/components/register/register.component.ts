import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){
    this.registerForm = this.fb.group({
      name: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      role: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.authService.register(this.registerForm.value).subscribe({
        next:() => {
          alert('Account Registered Successfully!');
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Error registering account:', err);
          alert('Something went wrong. Please try again later.');
        }
      });
    }else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
