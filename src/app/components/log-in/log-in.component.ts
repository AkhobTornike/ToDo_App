import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  authService = inject(AuthService);
  router = inject(Router);
  passwordVisible: boolean = false;
  errorMessage: string | null = null;
  resetPasswordVisible: boolean = false;


  applyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })  

  logInApplication() {
    const rowForm = this.applyForm.getRawValue();

    if (!rowForm.email || !rowForm.password) {
      this.errorMessage = "Please provide all required fields.";
      return;
    }

    this.authService.login(
      rowForm.email!,
      rowForm.password!
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('/profile')
      },
      error: (err) => {
        this.errorMessage = 'email or password is incorrect' + err.code;
        this.applyForm.reset();
      }
    })
    console.log("User Log In", this.applyForm.value)
    console.log(this.errorMessage)
  }

  showResetPassword() {
    this.resetPasswordVisible = true
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}
