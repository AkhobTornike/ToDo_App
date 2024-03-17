import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  User, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut, 
  updateEmail, 
  updatePassword, 
  updateProfile, 
  user 
} from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { UserInterface } from '../types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  currentUser: User | null = null;

  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined)

  constructor() {
    this.firebaseAuth.onAuthStateChanged(user => {
      this.currentUser = user
    })
  }



  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise)
  }

  login(
    email: string,
    password: string
    ): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<User> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(async response => {
      await updateProfile(
        response.user,
        { displayName: username }
      );
      return response.user;
    });
    return from(promise);
  }
  

  delete(): Observable<string> {
    if (!this.currentUser) {
      return throwError('User not logged in.');
    }
  
  
    return new Observable<string>(observer => {
      from(this.currentUser!.delete()).subscribe({
        next: () => {
          observer.complete();
        },
        error: error => {
          observer.error(error);
        }
      });
    });
  }

  resetPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email).then(() => {
      console.log('password reset email sent!');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
    return from(promise)
  }

  changePassword(email: string, user: User, newPassword: string): Observable<void> {
    const promise = updatePassword(user, newPassword).then(() => {
      console.log('password Updated(from auth.service)')
    }).catch((error) => {
      console.log("error: ", error.code)
    })

    return from(promise)
  }

  resetEmail(email: string, user: User): Observable<void> {
    console.log(email);
    console.log(user);
    const promise = updateEmail(user, email).then(() => {
      console.log('password Updated(from auth.service)');
    }).catch((error) => {
      console.log('error(from auth.service resetEmail)', error.code);
    })

    return from(promise)
  }

  updateProfile(username: string, url: string, user: User): Observable<void> {
    const promise = updateProfile(user, {
      displayName: username,
      photoURL: url
    }).then(() => {
      console.log('profile Updated')
    }).catch((error) => {
      console.log('error from auth.service: ', error)
    })
    
    return from(promise)
  }
}
