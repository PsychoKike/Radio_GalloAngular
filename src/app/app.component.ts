import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { filter } from 'rxjs/operators';

// Importamos los componentes (Asegúrate que las rutas "./..." coincidan con tus carpetas)
import { VistaRadioComponent } from './vista-radio/vista-radio.component';
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { PropuestaComponent } from './propuesta/propuesta.component';
import { VentasComponent } from './ventas/ventas.component';
import { CabinaComponent } from "./cabina/cabina.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { TemasComponent } from "./temas/temas.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    LoginComponent,
    RegistroComponent,
    VistaRadioComponent,
    DashboardComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'radiogallo';
  mostrarNavbar: boolean = true;
  tipoUsuario: string | null = ''; 

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/login') || url.includes('/registro')) {
        this.mostrarNavbar = false;
      } else {
        this.mostrarNavbar = true;
        this.actualizarTipoUsuario();
      }
    });
  }

  ngOnInit() {
    this.actualizarTipoUsuario();
  }

  actualizarTipoUsuario() {
    if (typeof localStorage !== 'undefined') {
      this.tipoUsuario = localStorage.getItem('tipoUsuario');
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}