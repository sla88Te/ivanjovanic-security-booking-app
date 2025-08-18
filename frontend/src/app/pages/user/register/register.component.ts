import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  

  email: string = '';
  password: string = '';
  name: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  form: any;

 
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('✅ RegisterComponent loaded');
    this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required]
});
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value || '';
    const valid = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(value);
    return valid ? null : { invalidPassword: true };
  }

  onSignupButtonClicked(): void {
    if (this.form.invalid) return;

    const { email, password, name, lastName, phoneNumber } = this.form.value;

    this.authService.signup(email, password, name, lastName, phoneNumber)
      .subscribe({
        next: (res: HttpResponse<any>) => {
          this.router.navigate(['/user/login']);
          this.successMessage = '✅ Successful registration! You can log in now.';
        },
        error: err => {
          this.errorMessage = err.status === 409
            ? '⚠️ Email is already registered.'
            : 'Registration failed. Please try again.';
        }
      });
  }
}
