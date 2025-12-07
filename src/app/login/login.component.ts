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
    password: ''
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
        localStorage.setItem('token', response.token);
        this.isLoading = false;
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
