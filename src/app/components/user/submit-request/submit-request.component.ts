import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-submit-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './submit-request.component.html',
  styleUrls: ['./submit-request.component.css']
})
export class SubmitRequestComponent {
  requestForm: FormGroup;
  name: string | null = localStorage.getItem('name') || '';
  email: string | null = localStorage.getItem('email') || '';
  username: string | null = localStorage.getItem('username') || '';

  constructor(private fb: FormBuilder, private requestService: RequestService) {
    this.requestForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      username: [this.username, Validators.required],
      product: ['', Validators.required],
      urgency: ['medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if(this.requestForm.valid) {
      this.requestService.addRequest(this.requestForm.value).subscribe({
        next: () => {
          alert('Request submitted successfully!');
          this.requestForm.reset({urgency: 'medium'}); // Reset form with default urgency
        },
        error: (err) => {
          console.error('Error submitting request:', err);
          alert('Something went wrong. Please try again later.');
        }
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
