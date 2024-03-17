import { Routes } from '@angular/router';

import { OnGoingComponent } from './components/on-going/on-going.component';
import { CreateNewComponent } from './components/create-new/create-new.component';
import { CanceledComponent } from './components/canceled/canceled.component';
import { FinishedComponent } from './components/finished/finished.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
    {path: 'on-going', component:OnGoingComponent, title: "On Going"},
    {path: 'finished', component:FinishedComponent, title: "Finished"},
    {path: 'canceled', component:CanceledComponent, title: "Canceled"},
    {path: 'create-new', component:CreateNewComponent, title: "Create New"},
    {path: 'profile', component:ProfileComponent, title: "Profile"},
    {path: 'profile/register', component:RegisterComponent, title: "Sign In"},
    {path: 'profile/log-in', component:LogInComponent, title: "Log In"},
    {path: 'profile/log-in/reset-password', component:ResetPasswordComponent, title: "Reset Password"},
];
