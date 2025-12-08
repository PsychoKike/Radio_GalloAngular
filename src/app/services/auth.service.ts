import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que este puerto coincida con tu Spring Boot (8080 o 3000)
  private baseUrl = 'http://192.168.193.146:3000'; 

  constructor(private http: HttpClient) { }

  // 1. FUNCIÓN PARA ENTRAR (Login) -> Usa /api/auth/login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
  }

  // 2. FUNCIÓN PARA GUARDAR (Registro) -> Usa /api/locutores/guardar
  // 🔥 ESTA ES LA QUE TE FALTABA O ESTABA MAL
  guardarLocutor(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/locutores/guardar`, data);
  }

  obtenerLocutores():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/api/locutores`);
  }
}
