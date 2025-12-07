import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { filter } from 'rxjs/operators';

// Importamos componentes
import { VistaRadioComponent } from './vista-radio/vista-radio.component';
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
// 1. IMPORTA LA CABINA AQUÍ
import { CabinaComponent } from './cabina/cabina.component';
import { PerfilComponent } from './perfil/perfil.component';
import { TemasComponent } from './temas/temas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LoginComponent, RegistroComponent, VistaRadioComponent, CabinaComponent, PerfilComponent, TemasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'radiogallo';
  
  // Variables para controlar la vista
  mostrarNavbar: boolean = true;
  tipoUsuario: string | null = ''; // Aquí guardaremos 'oyente' o 'locutor'

  constructor(private router: Router) {
    // Suscripción para detectar cambios en la URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      
      const url = event.urlAfterRedirects;

      // 1. SI ESTAMOS EN LOGIN O REGISTRO -> OCULTAR NAVBAR
      if (url.includes('/login') || url.includes('/registro')) {
        this.mostrarNavbar = false;
      } else {
        // 2. EN CUALQUIER OTRA PÁGINA -> MOSTRAR NAVBAR Y CHECAR USUARIO
        this.mostrarNavbar = true;
        this.actualizarTipoUsuario();
      }
    });
  }

  ngOnInit() {
    this.actualizarTipoUsuario();
  }

  // Función para leer del localStorage quién inició sesión
  actualizarTipoUsuario() {
    if (typeof localStorage !== 'undefined') {
      this.tipoUsuario = localStorage.getItem('tipoUsuario');
    }
  }

  // Función para salir
  cerrarSesion() {
    localStorage.clear(); // Borra el token y el tipo de usuario
    this.router.navigate(['/login']);
  }
}