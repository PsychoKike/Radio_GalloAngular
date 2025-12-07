import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. IMPORTAR ESTO

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule], // <--- 2. AGREGARLO AQUÍ
  templateUrl: './perfil.component.html',
  styles: [`.avatar-circle { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #d32f2f; }`]
})
export class PerfilComponent {
  // En el futuro, esto vendrá de tu AuthService
  usuario = {
    nombre: 'Usuario RadioGallo',
    email: 'usuario@uaa.edu.mx',
    tipo: typeof localStorage !== 'undefined' ? localStorage.getItem('tipoUsuario') || 'Desconocido' : 'Desconocido',
    bio: 'Amante de la música y la radio universitaria.'
  };
}