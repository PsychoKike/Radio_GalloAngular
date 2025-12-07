import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css']
})
export class TemasComponent {
  temas = [
    { titulo: 'Rock Clásico', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=60', desc: 'Los mejores hits de los 80s y 90s' },
    { titulo: 'Noticias UAA', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=500&q=60', desc: 'Todo lo que pasa en el campus' },
    { titulo: 'Jazz & Chill', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=500&q=60', desc: 'Para estudiar y relajarse' },
    { titulo: 'Deportes', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=60', desc: 'Resumen deportivo semanal' },
  ];
}