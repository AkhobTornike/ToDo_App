import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firebaseAuth = inject(Auth);
  authService = inject(AuthService);
  router = inject(Router)
  passwordVisible: boolean = false;
  resetPasswordVisible: boolean = false;

  storage = getStorage();

  imageUrl: string = ''

  constructor() { }

  applyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    resetpassword: new FormControl('', Validators.required),
  });

  errorMessage: string | null = null;

  registerApplication(): void {
    const rowForm = this.applyForm.getRawValue();

    if (!rowForm.email || !rowForm.username || !rowForm.password || !rowForm.resetpassword) {
      this.errorMessage = "Please provide all required fields.";
      return;
    }

    if (rowForm.password != rowForm.resetpassword) {
      this.errorMessage = "passwords don't match";
      return;
    }

    this.authService.register(
      rowForm.email!,
      rowForm.username!,
      rowForm.password!
    ).subscribe({
      next: () => {
        sendEmailVerification(this.firebaseAuth.currentUser!).then(() => {
          console.log('Check Email')
        })
        console.log("GO TO PROFILE");
        this.updateProfile(this.imageUrl)
        this.router.navigateByUrl('/profile');
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    })
    console.log("New User Sign In", this.applyForm.value)
  }

  submit(event: any) {
    const path = this.authService.currentUser?.uid
    const file = event.target.files[0]
    if (file) {
      const storageRef = ref(this.storage, '/' + path);
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('File uploaded successfully!');
        getDownloadURL(storageRef).then((url) => {
          console.log('Download URL:', url);
          this.imageUrl = url
        }).catch((error) => {
          console.error('Error getting download URL:', error);
        });
      }).catch((error) => {
        console.error('Error uploading file:', error);
      });
    }
  }

  updateProfile(URL: string): void {
    const username = this.authService.currentUser?.displayName;
    const url = URL
    const user = this.authService.currentUser

    this.authService.updateProfile(
      username!,
      url!,
      user!
    ).subscribe({
      next: () => {
        console.log('User Profile Updated With ImgUrl');
      },
      error: (err) => {
        console.log('from images component Error: ', err);
      }
    })
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleResetPasswordVisibility() {
    this.resetPasswordVisible = !this.resetPasswordVisible;
  }
}
