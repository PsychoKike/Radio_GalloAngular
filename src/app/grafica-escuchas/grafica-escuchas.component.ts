import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { IceCastServiceService } from '../services/ice-cast-service.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-grafica-escuchas',
  imports: [NgxChartsModule,CommonModule],
  templateUrl: './grafica-escuchas.component.html',
  styleUrl: './grafica-escuchas.component.css'
})
export class GraficaEscuchasComponent implements OnDestroy, OnInit {
// 👇 INPUTS: Recibimos órdenes del padre (la consola)
  data: {
    name: string,
    series: { name: string; value: number }[]
  }[] = [
    {
      name: 'Oyentes',
      series: []
    }
  ];


 colorScheme: Color = {
  name: 'redDarkTheme',
  selectable: true,
  group: ScaleType.Ordinal,
  // Usamos un rojo brillante (#ff3333) como color principal
  domain: ['#ff3333', '#ff6666', '#ffffff']
};  

  subscription!: Subscription;

  constructor(private icecast:IceCastServiceService) {}

  ngOnInit() {
    this.subscription = interval(5000).subscribe(() => {
      this.icecast.getListeners().subscribe(value => {
        this.addPoint(value);
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  addPoint(value: number) {
    const now = new Date().toLocaleTimeString();

    this.data[0].series.push({
      name: now,
      value
    });

    // Limitar los puntos (no hacer enorme la gráfica)
    if (this.data[0].series.length > 40) {
      this.data[0].series.shift();
    }

    // Forzar actualización en Angular
    this.data = [...this.data];
  }
}
