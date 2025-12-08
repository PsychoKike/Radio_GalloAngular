import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CommonModule,
    RouterLink
  ],

  templateUrl: './login.component.html',

  // 🔥 CORRECCIÓN IMPORTANTE: debe ser styleUrls (arreglo)
  styleUrls: ['./login.component.css']
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

    this.authService.login({
      ...this.credentials,
      captcha: this.captchaToken
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login correcto:', response);

        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.rol) {
          localStorage.setItem('tipoUsuario', response.rol);
        }

        const rol = response.rol;

        if (rol === 'locutor') {
          this.router.navigate(['/cabina']);
        } else if (rol === 'oyente') {
          this.router.navigate(['/radio']);
        } else {
          this.errorMessage = 'Login exitoso, pero el rol es desconocido.';
          this.router.navigate(['/radio']);
        }
      },

      error: (error) => {
        console.error('Error durante el login:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Credenciales o reCAPTCHA incorrectos.';
      }
    });
  }
}
