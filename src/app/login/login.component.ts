import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login correcto:', response);
        // Guardamos el token (si hubiera)
        localStorage.setItem('token', response.token);
        this.isLoading = false;
        
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }
}
