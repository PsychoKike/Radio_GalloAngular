import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que no falle el HTML

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styles: [`.avatar-circle { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #d32f2f; }`]
})
export class PerfilComponent {
  usuario = {
    nombre: 'Usuario RadioGallo',
    email: 'usuario@uaa.edu.mx',
    // Verificamos si existe localStorage para evitar errores
    tipo: typeof localStorage !== 'undefined' ? localStorage.getItem('tipoUsuario') || 'Desconocido' : 'Desconocido',
    bio: 'Amante de la música y la radio universitaria.'
  };
}