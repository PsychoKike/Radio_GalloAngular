import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'registro-Loc', component: RegistroComponent},
    {path: 'radio', component:DashboardComponent},
    { path: '**', redirectTo: 'login' }
];
