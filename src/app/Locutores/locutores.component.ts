// src/app/Locutores/locutores.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
// Importamos DatePipe para el formato de fecha en el HTML
import { PropuestaComponent }   from '../propuesta/propuesta.component'; 

// --- Interfaces de Datos ---

interface Direccion {
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

interface Locutor {
  id: number;
  nombreCompleto: string;
  nombreUsuario: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
  direccion: Direccion;
}

interface Propuesta {
  id: number;
  titulo: string;
  autor: string;
  fechaCreacion: Date;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

@Component({
  selector: 'app-locutores',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe, // Usamos DatePipe para formatear fechas
    PropuestaComponent // Importamos el componente de Propuestas 
  ],
  templateUrl: './locutores.component.html',
  styleUrls: ['./locutores.component.css']
})
export class LocutoresComponent implements OnInit {

  // Datos simulados para Locutores
  locutores: Locutor[] = [
    { id: 1, nombreCompleto: 'Juan Gallo Pérez', nombreUsuario: 'JuanGallo', telefono: '1234567890', email: 'juan@radio.com', estado: 'activo', 
      direccion: { calle: 'C. Principal #100', colonia: 'Centro', ciudad: 'Aguascalientes', estado: 'Ags', codigoPostal: '20000' } },
    { id: 2, nombreCompleto: 'Ana Radio Smith', nombreUsuario: 'AnaRadio', telefono: '0987654321', email: 'ana@radio.com', estado: 'inactivo', 
      direccion: { calle: 'Av. Secundaria #50', colonia: 'Norte', ciudad: 'Guadalajara', estado: 'Jal', codigoPostal: '44000' } },
    { id: 3, nombreCompleto: 'Carlos Locutora', nombreUsuario: 'CarlosL', telefono: '5551112233', email: 'carlos@radio.com', estado: 'activo', 
      direccion: { calle: 'Av. Libertad', colonia: 'Sur', ciudad: 'Monterrey', estado: 'NL', codigoPostal: '64000' } }
  ];

  // Datos simulados para Propuestas
  propuestas: Propuesta[] = [
    { id: 101, titulo: 'Especial Rock en español', autor: 'Juan Gallo', fechaCreacion: new Date('2025-11-20'), estado: 'Aprobada' },
    { id: 102, titulo: 'Entrevista a banda local', autor: 'Ana Radio', fechaCreacion: new Date('2025-12-01'), estado: 'Pendiente' },
    { id: 103, titulo: 'Cápsula de historia musical', autor: 'Carlos Locutora', fechaCreacion: new Date('2025-12-05'), estado: 'Rechazada' }
  ];

  // Controla la pestaña activa para el HTML
  activeTab: 'locutores' | 'propuestas' = 'locutores'; 

  constructor() { } 

  ngOnInit(): void { 
    // Aquí iría la llamada al servicio para obtener los datos reales
  }

  editarLocutor(id: number) {
    console.log(`Abriendo formulario de edición para Locutor ID: ${id}`);
    // Lógica para editar
  }
  
  // Método para cambiar la pestaña activa
  selectTab(tab: 'locutores' | 'propuestas'): void {
    this.activeTab = tab;
  }
}