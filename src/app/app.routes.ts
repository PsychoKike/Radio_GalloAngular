import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { VistaRadioComponent } from './vista-radio/vista-radio.component';
// Importamos los nuevos
import { TemasComponent } from './temas/temas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PropuestaComponent } from './propuesta/propuesta.component';
import { CabinaComponent } from './cabina/cabina.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro-Loc', component: RegistroComponent },
    
    // Vista común de radio
    { path: 'radio', component: VistaRadioComponent },

    // NUEVAS RUTAS
    { path: 'temas', component: TemasComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'propuesta', component: PropuestaComponent },
    { path: 'cabina', component: CabinaComponent }, // Ruta del locutor

    { path: '**', redirectTo: 'login' }
];