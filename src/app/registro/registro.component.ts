import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // <--- 1. Importamos herramientas de ruta
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; // <--- 2. Necesario para directivas básicas

@Component({
  selector: 'app-registro',
  standalone: true, // Aseguro que sea standalone
  imports: [FormsModule, RouterLink, CommonModule], // <--- Agregamos CommonModule
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  // Variable para saber qué mostrar en el HTML
  esOyente: boolean = false;

  locutor = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: {
      calle: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: ''
    }
  };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute, // <--- Para leer el ?tipo=oyente
    private router: Router         // <--- Para navegar al login
  ) {}

  // 3. Al iniciar, leemos la URL
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.esOyente = params['tipo'] === 'oyente';
      console.log('Modo registro:', this.esOyente ? 'Oyente' : 'Locutor');
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      
      // Aquí podrías decidir si llamar a guardarLocutor o guardarOyente
      // Por ahora usaremos el mismo servicio como pediste reciclar
      
      this.authService.guardarLocutor(this.locutor).subscribe({
        next: (res) => {
          // Mensaje personalizado
          const tipoUsuario = this.esOyente ? 'Oyente' : 'Locutor';
          alert(`¡${tipoUsuario} registrado con éxito!`);
          
          // 4. REDIRECCIÓN AL LOGIN
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error(err);
          alert('Error al enviar los datos');
        }
      });
    }
  }

  // 5. Función para el botón de Cancelar
  cancelar() {
    this.router.navigate(['/login']);
  }
}