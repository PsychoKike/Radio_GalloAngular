import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
// Importamos solo Router, ya que RouterLink está en el array imports del @Component
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  // Mantengo RouterLink aquí por si lo usas en el HTML
  imports: [FormsModule, Router, RecaptchaModule, RecaptchaFormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {
    username: '',
    password: ''
  };

  captchaToken: string | null = null;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onCaptchaResolved(token: string | null) {
    console.log("CAPTCHA resuelto:", token);
    this.captchaToken = token;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.captchaToken) {
      this.errorMessage = 'Por favor completa el reCAPTCHA para continuar.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Llama al servicio de autenticación
    this.authService.login({
      // 💡 Enviamos las credenciales y el token captcha
      ...this.credentials,
      captcha: this.captchaToken
    }).subscribe({
      // --- BLOQUE NEXT (Éxito) ---
      next: (response) => {
        this.isLoading = false;
        console.log('Login correcto:', response);

        // 1. Almacenar Token y Rol
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.rol) {
          localStorage.setItem('tipoUsuario', response.rol);
        }
        
        // 2. Lógica de Redirección basada en el Rol devuelto por el servidor
        const rol = response.rol;
        
        if (rol === 'locutor') {
          this.router.navigate(['/cabina']); // Vista del Locutor/Administrador
          console.log('Redirigiendo a vista de Locutor (Cabina).');
        } else if (rol === 'oyente') {
          this.router.navigate(['/radio']); // Vista del Oyente
          console.log('Redirigiendo a vista de Oyente (Radio).');
        } else {
          // Si el rol es desconocido o nulo
          this.errorMessage = 'Login exitoso, pero el rol es desconocido. Redirigiendo a /radio.';
          this.router.navigate(['/radio']); 
        }
      },
      
      // --- BLOQUE ERROR ---
      error: (error) => {
        console.error('Error durante el login:', error);
        this.isLoading = false;
        
        // Mensaje de error más específico si es posible, si no, genérico.
        this.errorMessage = error.error?.message || 'Credenciales o reCAPTCHA incorrectos.';
      }
    });
  }
}