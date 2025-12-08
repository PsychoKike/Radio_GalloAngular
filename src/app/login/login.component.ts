import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
// 👇 1. VERIFICA ESTA LÍNEA TAMBIÉN
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RecaptchaModule, RecaptchaFormsModule, CommonModule],
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
    private router: Router // 👈 Verifica que 'Router' esté en color (significa que lo reconoce)
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
        const rol = response.rol; // O response.tipoUsuario (según tu backend/servicio)

        if (rol === 'locutor') {
          this.router.navigate(['/cabina']);
        } else {
          this.router.navigate(['/radio']);
        }
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.errorMessage = 'Credenciales incorrectas.';
      }
    });
  }
}