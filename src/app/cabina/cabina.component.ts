import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabina.component.html',
  styleUrls: ['./cabina.component.css']
})
export class CabinaComponent implements OnDestroy {

  // Variables de estado
  enVivo: boolean = false;
  enPausa: boolean = false;
  
  // Variables del cronómetro
  tiempoSegundos: number = 0;
  tiempoFormateado: string = '00:00:00';
  intervalo: any; // Aquí guardamos el reloj

  // Lista simulada de oyentes
  oyentes = [
    { nombre: 'Juan Pérez', estado: 'Escuchando' },
    { nombre: 'Maria L.', estado: 'Escuchando' },
    { nombre: 'Admin', estado: 'Moderando' },
    { nombre: 'Carlos R.', estado: 'Conectando...' }
  ];

  constructor() { }

  // 1. INICIAR TRANSMISIÓN (Botón Micrófono)
  iniciarTransmision() {
    if (!this.enVivo || this.enPausa) {
      this.enVivo = true;
      this.enPausa = false;
      
      // Iniciamos el intervalo que corre cada segundo (1000 ms)
      this.intervalo = setInterval(() => {
        this.tiempoSegundos++;
        this.actualizarFormatoTiempo();
      }, 1000);
    }
  }

  // 2. PAUSAR (Botón Pausa)
  pausarTransmision() {
    if (this.enVivo) {
      this.enPausa = true;
      clearInterval(this.intervalo); // Detiene el contador pero no lo reinicia
    }
  }

  // 3. DETENER (Botón Stop)
  detenerTransmision() {
    this.enVivo = false;
    this.enPausa = false;
    this.tiempoSegundos = 0;
    this.tiempoFormateado = '00:00:00';
    clearInterval(this.intervalo); // Detiene y mata el reloj
  }

  // Función auxiliar para convertir segundos a HH:MM:SS
  actualizarFormatoTiempo() {
    const horas = Math.floor(this.tiempoSegundos / 3600);
    const minutos = Math.floor((this.tiempoSegundos % 3600) / 60);
    const segundos = this.tiempoSegundos % 60;

    // Agregamos un '0' al inicio si es menor a 10 (ej: 09 en vez de 9)
    this.tiempoFormateado = 
      `${this.pad(horas)}:${this.pad(minutos)}:${this.pad(segundos)}`;
  }

  pad(valor: number): string {
    return valor < 10 ? `0${valor}` : valor.toString();
  }

  // Importante: Si el usuario se sale de la página, matamos el reloj para que no consuma memoria
  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}