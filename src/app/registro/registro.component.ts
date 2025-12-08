import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

// ⚠️ ASEGÚRATE DE QUE ESTA RUTA SEA CORRECTA O BORRA ESTA LÍNEA SI NO USAS ZEROBOUNCE
import { ZerobounceService } from '../services/zerobounce.service'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  // Variables de estado
  esOyente: boolean = false;
  
  // Variables para la validación de correo (que te faltaban declarar)
  correoStatus: string | null = null;
  correoMensaje: string = "";
  emailTimeout: any;

  // Objeto principal
  usuario = { 
    nombre: '',
    username: '', 
    email: '',
    password: '',
    telefono: '',
    rol: '', 
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
    private router: Router,
    private zbService: ZerobounceService // Descomenta esto si tienes el servicio
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.esOyente = params['tipo'] === 'oyente';
      console.log('Modo registro:', this.esOyente ? 'Oyente' : 'Locutor');
    });
  }

  /* * LOGICA DE VALIDACIÓN DE CORREO 
   * (He cambiado 'this.locutor' por 'this.usuario' para que funcione)
   */
  validarCorreo() {
    const email = this.usuario.email; // CORREGIDO: usar this.usuario

    if (!email || email.length < 5) {
      this.correoStatus = null;
      this.correoMensaje = "";
      return;
    }

   
    this.zbService.validateEmail(email).subscribe({
      next: (resp: any) => {
        if (resp.status === 'valid') {
          this.correoStatus = 'valid';
          this.correoMensaje = "Correo válido ";
        } else {
          this.correoStatus = 'invalid';
          this.correoMensaje = "Correo inválido ";
        }
      },
      error: () => {
        this.correoStatus = 'invalid';
        this.correoMensaje = "No se pudo validar el correo";
      }
    });
  }

  onEmailChange(email: string) {
    this.usuario.email = email; // CORREGIDO: usar this.usuario

    this.correoStatus = null;
    this.correoMensaje = "";

    if (this.emailTimeout) {
      clearTimeout(this.emailTimeout);
    }

    this.emailTimeout = setTimeout(() => {
      this.validarCorreo();
    }, 1000);
  }

  /*
   * MÉTODO ONSUBMIT UNIFICADO
   * He fusionado la lógica: primero valida, luego asigna rol, luego registra.
   */
  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    // 1. Asignar el rol antes de nada
    this.usuario.rol = this.esOyente ? 'oyente' : 'locutor';

    // 2. Aquí iría la validación de ZeroBounce si la quieres bloquear el envío
    if (this.correoStatus !== 'valid') { alert('Correo inválido'); return; }

    // 3. Llamar al servicio de registro
    this.authService.register(this.usuario).subscribe({
      next: (res) => {
        // Usamos el rol que nos devuelve el servidor o el local
        const tipoUsuario = this.esOyente ? 'Oyente' : 'Locutor';
        alert(`¡${tipoUsuario} registrado con éxito!`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error && err.error.error ? err.error.error : 'Error al enviar los datos.';
        alert(errorMsg);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}