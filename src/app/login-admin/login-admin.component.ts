import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Guardamos token y rol
        localStorage.setItem('token', response.token);
        localStorage.setItem('tipoUsuario', 'admin'); 
        
        this.isLoading = false;
        // REDIRECCIÓN: Manda directo a las vistas de admin
        this.router.navigate(['/cabina']); 
      },
      error: (error) => {
        this.errorMessage = 'Credenciales de administrador inválidas';
        this.isLoading = false;
      }
    });
  }
}