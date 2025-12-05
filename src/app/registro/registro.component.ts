import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule,RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
locutor = {
    nombre: '',
    email: '',
    telefono: '',
    // Aquí representamos la relación con la tabla DIRECCION
    direccion: {
      calle: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: ''
    }
  };

  constructor(private authService:AuthService){}

  onSubmit(form: any) {
    if (form.valid) {
       this.authService.guardarLocutor(this.locutor).subscribe({
        next: (res) => alert('¡Enviado y encriptado en el servidor!'),
        error: (err) => alert('Error al enviar')
      });
    }
  }
}
