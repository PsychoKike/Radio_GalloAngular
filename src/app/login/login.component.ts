import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
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
      // En tu login.component.ts dentro del subscribe > next:

      next: (response) => {
        console.log('Login correcto:', response);
        localStorage.setItem('token', response.token);
        // OJO: Cambia esto según tu prueba: 'oyente' o 'locutor'
        localStorage.setItem('tipoUsuario', 'locutor'); 
        this.isLoading = false;
        // Redirigir a la vista de radio
        this.router.navigate(['/radio']); 
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }
}
