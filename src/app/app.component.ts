import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para directivas básicas

// Importamos tus otros componentes
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { ListaLocComponent } from "./lista-loc/lista-loc.component";
import { VistaRadioComponent } from './vista-radio/vista-radio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Aquí registramos todos los componentes que usas en el HTML
  imports: [
    RouterOutlet, FormsModule, CommonModule, RouterLink, DashboardComponent, LoginComponent, RegistroComponent, ListaLocComponent, VistaRadioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'radiogallo';
}