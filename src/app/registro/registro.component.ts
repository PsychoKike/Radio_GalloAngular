import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importar NgForm para mejor tipado
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  // Variable para saber qué mostrar en el HTML
  esOyente: boolean = false;
  usuario = { // Cambié el nombre de 'locutor' a 'usuario' para ser más universal
    nombre: '',
    username: '', // ¡CRÍTICO! Añadir el campo username para el login
    email: '',
    password: '',
    telefono: '',
    rol: '', // ¡CRÍTICO! Añadir el campo rol
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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.esOyente = params['tipo'] === 'oyente';
      console.log('Modo registro:', this.esOyente ? 'Oyente' : 'Locutor');
    });
  }

  // Cambiamos el tipo de 'form' a NgForm
  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    // 🔑 PASO CRÍTICO AÑADIDO: ASIGNAR EL ROL ANTES DE ENVIAR
    this.usuario.rol = this.esOyente ? 'oyente' : 'locutor';

    // 1. Llamar al nuevo método universal 'register'
    this.authService.register(this.usuario).subscribe({
      next: (res) => {

        // Usamos el rol que nos devuelve el servidor
        const tipoUsuario = res.rol === 'oyente' ? 'Oyente' : 'Locutor';
        alert(`¡${tipoUsuario} registrado con éxito!`);

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        // Utilizamos el mensaje de error del backend si existe
        const errorMsg = err.error && err.error.error ? err.error.error : 'Error al enviar los datos. Revisa si el usuario/email ya existe.';
        alert(errorMsg);
      }
    });
  }

  // 5. Función para el botón de Cancelar
  cancelar() {
    this.router.navigate(['/login']);
  }
}









// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // <--- 1. Importamos herramientas de ruta
// import { AuthService } from '../services/auth.service';
// import { CommonModule } from '@angular/common'; // <--- 2. Necesario para directivas básicas

// @Component({
//   selector: 'app-registro',
//   standalone: true, // Aseguro que sea standalone
//   imports: [FormsModule, RouterLink, CommonModule], // <--- Agregamos CommonModule
//   templateUrl: './registro.component.html',
//   styleUrl: './registro.component.css'
// })
// export class RegistroComponent implements OnInit {

//   // Variable para saber qué mostrar en el HTML
//   esOyente: boolean = false;
//   usuario = { // Cambié el nombre de 'locutor' a 'usuario' para ser más universal
//     nombre: '',
//     username: '', // ¡CRÍTICO! Añadir el campo username para el login
//     email: '',
//     password: '',
//     telefono: '',
//     rol: '', // ¡CRÍTICO! Añadir el campo rol
//     direccion: {
//       calle: '',
//       colonia: '',
//       ciudad: '',
//       estado: '',
//       codigoPostal: ''
//     }
//   };
//   constructor(
//     private authService: AuthService,
//     private route: ActivatedRoute, // <--- Para leer el ?tipo=oyente
//     private router: Router         // <--- Para navegar al login
//   ) { }

//   // 3. Al iniciar, leemos la URL
//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       this.esOyente = params['tipo'] === 'oyente';
//       console.log('Modo registro:', this.esOyente ? 'Oyente' : 'Locutor');
//     });
//   }

//   onSubmit(form: any) {
//     if (form.valid) {

//       // 1. Llamar al nuevo método universal 'register'
//       this.authService.register(this.usuario).subscribe({ // Usar this.usuario
//         next: (res) => {

//           // Usamos el rol que nos devuelve el servidor
//           const tipoUsuario = res.rol === 'oyente' ? 'Oyente' : 'Locutor';
//           alert(`¡${tipoUsuario} registrado con éxito!`);

//           this.router.navigate(['/login']);
//         },
//         error: (err) => {
//           console.error(err);
//           alert('Error al enviar los datos. Revisa si el usuario/email ya existe.');
//         }
//       });
//     }
//   }

//   // 5. Función para el botón de Cancelar
//   cancelar() {
//     this.router.navigate(['/login']);
//   }
// }