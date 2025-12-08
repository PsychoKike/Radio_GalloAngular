// src/app/services/data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Locutor, Propuesta } from '../Locutores/locutores.component';
// 💡 Importamos las INTERFACES de datos exportadas

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Asegúrate de que esta IP/puerto es la correcta
  private baseUrl = 'http://192.168.193.146:3000/api'; 

  constructor(private http: HttpClient) { }

  // 💡 CORREGIDO: Esperamos un array de la interfaz Locutor (exportada desde el componente)
  getLocutores(): Observable<Locutor[]> { 
    return this.http.get<Locutor[]>(`${this.baseUrl}/locutores`);
  }

  // 💡 CORREGIDO: Esperamos un array de la interfaz Propuesta (exportada desde el componente)
  getPropuestas(): Observable<Propuesta[]> { 
    return this.http.get<Propuesta[]>(`${this.baseUrl}/propuestas`);
  }

  
}