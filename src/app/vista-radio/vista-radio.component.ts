import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vista-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-radio.component.html',
  styleUrls: ['./vista-radio.component.css']
})
export class VistaRadioComponent {
  @Input() imagenPersonalizadaSrc: string = '';
  
  // Variable para controlar el estado (false = pausado, true = reproduciendo)
  estaReproduciendo: boolean = false;

  constructor() { }

  // Función que se activa al dar click en el botón
  alternarReproduccion() {
    this.estaReproduciendo = !this.estaReproduciendo;
    
    // Aquí podrías agregar la lógica real del audio más adelante
    if (this.estaReproduciendo) {
      console.log('Reproduciendo música...');
    } else {
      console.log('Pausado.');
    }
  }
}