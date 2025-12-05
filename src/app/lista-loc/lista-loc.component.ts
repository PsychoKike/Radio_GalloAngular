import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-lista-loc',
  imports: [],
  templateUrl: './lista-loc.component.html',
  styleUrl: './lista-loc.component.css'
})
export class ListaLocComponent {
 locutores: any[] = [];
  cargando = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.authService.obtenerLocutores().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.locutores = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }
}
