import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { KickboxService } from '../services/kickbox.service';

// Regex estricta para validar formato del correo
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  
  esOyente: boolean = false;

  correoStatus: string | null = null;
  correoMensaje: string = "";
  emailTimeout: any;

  usuario = {
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    password: '',
    registro: '',
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
    private kickService: KickboxService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

    ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.esOyente = params['tipo'] === 'oyente';
    });
  }

  validarCorreo() {
    const email = this.usuario.email;

    // Validación local
    if (!email || email.length < 5) {
      this.correoStatus = null;
      this.correoMensaje = "";
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      this.correoStatus = 'invalid';
      this.correoMensaje = "Formato de correo incorrecto.";
      return;
    }

    // Validación con Kickbox
    this.kickService.validateEmail(email).subscribe({
      next: (resp: any) => {

        // API FREE: resp.disposable (true/false)
        if (resp.disposable === false) {
          this.correoStatus = 'valid';
          this.correoMensaje = "Correo válido.";
        } else {
          this.correoStatus = 'invalid';
          this.correoMensaje = "Correo temporal o desechable.";
        }

      },
      error: () => {
        this.correoStatus = 'invalid';
        this.correoMensaje = "No se pudo validar el correo.";
      }
    });
  }

  onEmailChange(email: string) {
    this.usuario.email = email;

    this.correoStatus = null;
    this.correoMensaje = "";

    if (this.emailTimeout) clearTimeout(this.emailTimeout);

    this.emailTimeout = setTimeout(() => {
      this.validarCorreo();
    }, 1000);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.usuario.rol = this.esOyente ? 'oyente' : 'locutor';

    // No continúa si el correo no es válido
    if (this.correoStatus !== 'valid') {
      alert("Correo inválido");
      return;
    }

    this.authService.register(this.usuario).subscribe({
      next: () => {
        const tipo = this.esOyente ? "Oyente" : "Locutor";
        alert('${tipo} registrado con éxito');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error?.error || "Error al registrar.";
        alert(errorMsg);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}