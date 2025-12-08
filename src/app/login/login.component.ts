import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {
    username: '',
    password: '',
    
  };

  captchaToken: string | null = null;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onCaptchaResolved(token: string | null) {
  console.log("CAPTCHA:", token);
  this.captchaToken = token;
}


  onSubmit() {
  if (!this.captchaToken) {
    this.errorMessage = 'Por favor completa el reCAPTCHA';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  
    this.authService.login({
        ...this.credentials,
        captcha: this.captchaToken
      }).subscribe({
        next: (response) => {
          console.log('Login correcto:', response);
        
        this.isLoading = false;

      if (response.token) {
           localStorage.setItem('token', response.token);
        }

        // 2. Guardar el Tipo de Usuario (para que la Navbar sepa qué mostrar)
        // Asumimos que response.rol trae 'locutor' u 'oyente'
        if (response.rol) {
           localStorage.setItem('tipoUsuario', response.rol);
        }
        
        // 🚨 ¡CRÍTICO! Lógica de Redirección basada en el Rol devuelto por el servidor
        const rol = response.rol;
        
        if (rol === 'locutor') {
          // Redirigir a la vista del Locutor
          this.router.navigate(['/cabina']); // Asumo que '/radio' es la vista del locutor
          console.log('Redirigiendo a vista de Locutor.');
        } else if (rol === 'oyente') {
          // Redirigir a la vista del Oyente
          this.router.navigate(['/radio']); // **¡DEBES CREAR ESTA RUTA!**
          console.log('Redirigiendo a vista de Oyente.');
        } else {
          // Opción por defecto o error de rol
          this.router.navigate(['/cabina']); 
          console.error('Rol desconocido:', rol);
        }
      },

      error: (error) => {
        // ... (manejo de errores)
      }
    });
  }

  
}





// import { Component } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   imports: [FormsModule,RouterLink],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
//   credentials = {
//     username: '',
//     password: ''
//   };
  
//   errorMessage = '';
//   isLoading = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit() {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.authService.login(this.credentials).subscribe({
//       next: (response) => {
//         console.log('Login correcto:', response);
//         localStorage.setItem('token', response.token);
//         this.isLoading = false;
        
//         this.router.navigate(['/dashboard']); //Siguiente pantalla
//       },
//       error: (error) => {
//         console.error('Error:', error);
//         this.errorMessage = 'Usuario o contraseña incorrectos';
//         this.isLoading = false;
//       }
//     });
//   }
// }
