import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vista-radio',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './vista-radio.component.html',
  styleUrls: ['./vista-radio.component.css']
})
export class VistaRadioComponent {
  @Input() imagenPersonalizadaSrc: string = '';

  // /radio es la pre configurada 
  private URLRadio="http://192.168.1.9:8000/radio";

  private audio=new Audio();

  
  // Variable para controlar el estado (false = pausado, true = reproduciendo)
  estaReproduciendo: boolean = false;

  constructor() {
    this.audio.crossOrigin="anonymous";

    this.audio.onended=()=>{
      this.estaReproduciendo=false;
    };

    this.audio.onerror=(e)=>{
      console.error("Error al reproducir: ",e);
      this.estaReproduciendo=false;
    };
   }

  // Función que se activa al dar click en el botón
alternarReproduccion() {
    if (this.estaReproduciendo) {
      // --- PAUSAR ---
      this.audio.pause();
      // Importante: Reiniciar el src para dejar de descargar datos
      this.audio.src = ''; 
      this.estaReproduciendo = false;
      console.log('📻 Radio detenida.');
      
    } else {
      // --- REPRODUCIR ---
      console.log('Conectando a la señal...');
      
      // TRUCO PRO: Agregamos '?t=' + Date.now()
      // Esto engaña al navegador para que crea que es un archivo nuevo
      // y no use una versión vieja guardada en caché. Asegura el "EN VIVO".
      this.audio.src = `${this.URLRadio}?t=${Date.now()}`;
      
      this.audio.load();
      
      this.audio.play()
        .then(() => {
          this.estaReproduciendo = true;
          console.log('🎶 Reproduciendo en vivo!');
        })
        .catch(error => {
          console.error("No se pudo reproducir. ¿El servidor está prendido?", error);
          alert("No hay señal de radio en este momento 📵");
        });
    }
  }

  // Si el usuario cambia de página, matamos el audio para que no siga sonando
  ngOnDestroy() {
    if (this.estaReproduciendo) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}