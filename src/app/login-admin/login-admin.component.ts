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
  // Las credenciales se obtienen del formulario
  credentials = { username: '', password: '' }; 
  errorMessage = '';
  isLoading = false;

  // ⭐ CREDENCIALES FIJAS PARA COMPARACIÓN EN FRONT-END (Solo para pruebas/debug)
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'Redes3.';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

 
    if (this.credentials.username !== this.ADMIN_USER || this.credentials.password !== this.ADMIN_PASS) {
        this.errorMessage = 'Credenciales de administrador incorrectas (Verificación Front-end).';
        this.isLoading = false;
        return; // Detiene el proceso si no coincide
    }else{

       this.router.navigate(['locutores']); 
    }
    
  
    // this.authService.login(this.credentials).subscribe({
    //   next: (response) => {
        
    //     // Verificación de Rol del Back-end
    //     if (response.rol === 'administrador') {
            
    //         localStorage.setItem('auth_token', response.token); 
    //         localStorage.setItem('user_role', response.rol);
            
    //         this.isLoading = false;
    //         this.router.navigate(['/cabina']); 
            
    //     } else {
    //          this.errorMessage = 'Acceso denegado: El rol no es administrador.';
    //          this.isLoading = false;
    //     }
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     // Si llegamos aquí, significa que el Back-end rechazó la clave (probablemente por 'bad decrypt')
    //     this.errorMessage = 'Fallo de autenticación en el servidor. Revise la clave de cifrado.';
    //     console.error('Error del servidor:', error.error?.error);
    //   }
    // });
  }
}
// import { Component } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login-admin',
//   standalone: true,
//   imports: [FormsModule, RouterLink],
//   templateUrl: './login-admin.component.html',
//   styleUrl: './login-admin.component.css'
// })
// export class LoginAdminComponent {
//   credentials = { username: '', password: '' };
//   errorMessage = '';
//   isLoading = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit() {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.authService.login(this.credentials).subscribe({
//       next: (response) => {
//         // Guardamos token y rol
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('tipoUsuario', 'admin'); 
        
//         this.isLoading = false;
//         // REDIRECCIÓN: Manda directo a las vistas de admin
//         this.router.navigate(['/cabina']); 
//       },
//       error: (error) => {
//         this.errorMessage = 'Credenciales de administrador inválidas';
//         this.isLoading = false;
//       }
//     });
//   }
// }