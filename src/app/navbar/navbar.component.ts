import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  // Variable para saber qué menú pintar
  tipoUsuario: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Al cargar el componente, leemos quién está conectado
    if (typeof localStorage !== 'undefined') {
      this.tipoUsuario = localStorage.getItem('tipoUsuario');
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}