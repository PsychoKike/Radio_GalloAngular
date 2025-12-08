// src/app/Locutores/locutores.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { PropuestaComponent } from '../propuesta/propuesta.component'; 
import { DataService } from '../services/data.service'; 

// --- Interfaces de Datos ---
interface Direccion {
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

export interface Locutor {
  id: number;
  nombreCompleto: string; // 👈 ESTE CAMPO DEBE EXISTIR EN TU JSON
  nombreUsuario: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
  direccion: Direccion;
}

export interface Propuesta {
  id: number;
  titulo: string;
  autor: string;
  fechaCreacion: string | Date; 
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

@Component({
  selector: 'app-locutores',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PropuestaComponent,
    HttpClientModule, 
    FormsModule
  ],
  templateUrl: './locutores.component.html',
  styleUrls: ['./locutores.component.css'],
  providers: [DataService]
})
export class LocutoresComponent implements OnInit {

  locutores: Locutor[] = [];
  propuestas: Propuesta[] = [];

  activeTab: 'locutores' | 'propuestas' = 'locutores'; 
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private dataService: DataService) { } 

  ngOnInit(): void { 
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // --- Cargar Locutores ---
    this.dataService.getLocutores().subscribe({
      next: (data) => {
        this.locutores = data;
        
          // Si ambas llamadas fallan, el isLoading se establecería en false.
          // Para ser más precisos, necesitamos un contador de peticiones.
          // Pero por ahora, el siguiente error establecerá isLoading=false.
      },
      error: (err) => {
        console.error('Error al cargar Locutores:', err);
        this.errorMessage = 'No se pudieron cargar los datos de Locutores.';
        this.isLoading = false;
      }
    });

    // --- Cargar Propuestas ---
    this.dataService.getPropuestas().subscribe({
      next: (data) => {
        // 💡 CORRECCIÓN APLICADA AQUÍ: Restauramos el mapeo de la fecha.
        this.propuestas = data.map(p => ({
            ...p,
            fechaCreacion: p.fechaCreacion ? new Date(p.fechaCreacion) : new Date()
        })) as Propuesta[]; 
        
        this.isLoading = false; // Solo ponemos isLoading en false después de la última petición
      },
      error: (err) => {
        console.error('Error al cargar Propuestas:', err);
        if (!this.errorMessage) {
            this.errorMessage = 'No se pudieron cargar los datos de Propuestas.';
        }
        this.isLoading = false;
      }
    });
  }

  editarLocutor(id: number) {
    console.log(`Abriendo formulario de edición para Locutor ID: ${id}`);
  }
  
  selectTab(tab: 'locutores' | 'propuestas'): void {
    this.activeTab = tab;
  }
}