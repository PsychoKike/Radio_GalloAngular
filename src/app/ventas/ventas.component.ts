import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los inputs

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  
  // Objeto para guardar los datos del formulario
  formulario = {
    nombreCompleto: '',
    descripcionProducto: '',
    imagen: null as any, // Aquí guardaremos el archivo
    tarjeta: {
      nombreTitular: '',
      numero: '',
      fechaVencimiento: '',
      cvv: ''
    }
  };

  constructor() { }

  // Función para detectar cuando el usuario selecciona una imagen
  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formulario.imagen = file;
      console.log('Imagen seleccionada:', file.name);
    }
  }

  onSubmit() {
    // Aquí iría la lógica para enviar al backend
    console.log('Datos de la venta:', this.formulario);
    alert('¡Producto publicado! Se ha realizado el cargo de $20.00 MXN a tu tarjeta.');
    
    // Opcional: Limpiar formulario
    // this.formulario = ... (resetear valores)
  }
}