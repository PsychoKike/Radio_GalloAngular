import { Component, OnInit } from '@angular/core';

// Define la estructura de la propuesta
interface Propuesta {
  id: number;
  titulo: string;
  descripcion: string;
  locutor: string;
  fechaEnvio: string;
  estado: 'Pendiente' | 'Aceptada' | 'Rechazada';
}

@Component({
  selector: 'app-propuestas',
  templateUrl: './propuestas.component.html',
  styleUrls: ['./propuestas.component.css']
})
export class PropuestasComponent implements OnInit {

  propuestas: Propuesta[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cargarPropuestas();
  }

  // TODO: Espacio para la llamada al backend para obtener las propuestas pendientes
  cargarPropuestas(): void {
    console.log('Cargando propuestas pendientes...');
    // Ejemplo de datos mock (reemplazar con tu llamada HTTP, filtrando por estado: Pendiente)
    this.propuestas = [
      { id: 1, titulo: 'Podcast sobre IA', descripcion: 'Una serie de 10 episodios sobre el futuro de la IA.', locutor: 'Juan Pérez', fechaEnvio: '2025-11-20', estado: 'Pendiente' },
      { id: 2, titulo: 'Entrevistas a músicos', descripcion: 'Entrevistas en vivo con artistas locales.', locutor: 'Ana Gómez', fechaEnvio: '2025-12-01', estado: 'Pendiente' },
      // Otras propuestas con estados ya resueltos, si se desea
      // { id: 3, titulo: 'Recetas de postres', descripcion: 'Recetas fáciles para el hogar.', locutor: 'Chef María', fechaEnvio: '2025-10-15', estado: 'Aceptada' },
    ];
  }

  // TODO: Espacio para la llamada al backend para actualizar el estado de la propuesta
  actualizarPropuesta(id: number, nuevoEstado: 'Aceptada' | 'Rechazada'): void {
    console.log(`Actualizando propuesta ${id} a estado: ${nuevoEstado}`);
    // Aquí iría tu llamada HTTP (PUT o PATCH) al backend
    alert(`Propuesta ${id} ha sido ${nuevoEstado}.`);
    // Recargar la lista después de la acción (o eliminar el elemento de la lista localmente)
    this.cargarPropuestas(); 
  }

  aceptarPropuesta(id: number): void {
    this.actualizarPropuesta(id, 'Aceptada');
  }

  rechazarPropuesta(id: number): void {
    this.actualizarPropuesta(id, 'Rechazada');
  }
}