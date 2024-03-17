import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  errorMessage: string | null = null;
  authService = inject(AuthService);


  applyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetPasswordApplication(): void {
    const email = this.applyForm.getRawValue().email;

    if (!email) {
      this.errorMessage = "Please Fill the value";
    }

    this.authService.resetPassword(
      email!
    ).subscribe({
      next: () => {
        console.log('reset pasword from reset-password.component')
        this.errorMessage = "Check Your Email";
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    })
    console.log('please check Your')
  }

}
