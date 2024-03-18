import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router)
  storage = getStorage();

  photoUrl: string | null = null
  loadingpage: boolean = false;
  loading: boolean = true;
  errorMessage: string | null = null;
  usernameInputVissible: boolean = false;
  imageUrl: string = '';


  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 5000)
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSig.set(null)
      }
      this.photoUrl = this.authService.currentUser?.photoURL!
    })
    setTimeout(() => {
      this.loadingpage = true;
    }, 5000);

  }

  logOut(): void {
    this.authService.logout();
    window.location.reload();
  }

  deleteAccount(): void {
    this.authService.delete().subscribe({
      next: () => {
        this.router.navigate(['/on-going']);
        window.alert(`Account deleted successfully.`);
      },
      error: (err) => {
        window.alert(`Error deleting account: ${err.message}`);
      }
    });
  }

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  usernameForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
  })

  showUsernameInputer() {
    if (!this.usernameInputVissible) {
      this.usernameInputVissible = true
    } else if (this.usernameInputVissible) {
      this.changeUsernameApplication()
      this.usernameInputVissible = false
      window.location.reload();
    }
  }

  resetPasswordLogInApplication() {
    const email = this.authService.currentUser?.email

    if (!email) {
      this.errorMessage = "Please Fill the value";
    }

    this.authService.resetPassword(
      email!
    ).subscribe({
      next: () => {
        this.errorMessage = "Check Your Email";
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    })
  }

  changeUsernameApplication(): void {
    const user = this.authService.currentUser;
    const url = user?.photoURL;
    const username = this.usernameForm.getRawValue().username;

    this.authService.updateProfile(
      username!,
      url!,
      user!
    ).subscribe({
      next: () => {
      },
      error: (err) => {
      }
    })
  }

  submit(event: any) {
    const path = this.authService.currentUser?.uid
    const file = event.target.files[0]
    if (file) {
      const storageRef = ref(this.storage, '/' + path);
      uploadBytes(storageRef, file).then((snapshot) => {
        this.router.navigateByUrl('/')
        getDownloadURL(storageRef).then((url) => {
          this.imageUrl = url
          this.updateProfileImg(url);
          this.router.navigateByUrl('/profile')
        }).catch((error) => {
          console.error('Error getting download URL:', error);
        });
      }).catch((error) => {
        console.error('Error uploading file:', error);
      });
    }
  }

  updateProfileImg(URL: string): void {
    const username = this.authService.currentUser?.displayName;
    const url = URL
    const user = this.authService.currentUser

    this.authService.updateProfile(
      username!,
      url!,
      user!
    ).subscribe({
      next: () => {
      },
      error: (err) => {
      }
    })
  }
}

