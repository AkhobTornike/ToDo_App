import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyDzKm0jRADv7C01dxQxm48jz-F8zXsFX0A",
  authDomain: "todo-app-885a7.firebaseapp.com",
  projectId: "todo-app-885a7",
  storageBucket: "todo-app-885a7.appspot.com",
  messagingSenderId: "692953837600",
  appId: "1:692953837600:web:ebe7f8f2bd663c09800c45"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig))),
      importProvidersFrom(provideAuth(() => getAuth())),
      importProvidersFrom(provideFirestore(() => getFirestore())),
      importProvidersFrom(provideStorage(() => getStorage())), provideAnimationsAsync()
  ]
};
