import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs'; // Importamos 'tap' para hacer cosas antes de responder
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // Tu backend real

  constructor(private http: HttpClient) { }

  // 1. LOGIN MEJORADO (Guarda los datos automáticamente)
  login(credentials: any): Observable<any> {
    // SIMULACIÓN (Aquí iría tu this.http.post real)
    const rolSimulado = credentials.username === 'admin' ? 'locutor' : 'oyente';
    
    const respuestaSimulada = {
      token: 'token-xyz-123',
      rol: rolSimulado,
      username: credentials.username
    };

    return of(respuestaSimulada).pipe(
      delay(500), // Simula red
      tap(response => {
        // ¡AQUÍ GUARDAMOS LA VARIABLE AUTOMÁTICAMENTE!
        // 'tap' permite ejecutar código sin alterar la respuesta
        this.guardarSesion(response); 
      })
    );
  }

  // 2. FUNCIÓN PARA GUARDAR EN LOCALSTORAGE (Centralizada)
  private guardarSesion(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('tipoUsuario', data.rol);
    localStorage.setItem('username', data.username);
  }

  // 3. FUNCIÓN PARA QUE EL NAVBAR PREGUNTE EL ROL
  getRolUsuario(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tipoUsuario');
    }
    return null;
  }

  // 4. FUNCIÓN PARA SALIR
  logout() {
    localStorage.clear();
  }

  register(data: any): Observable<any> {
        return this.http.post('${this.baseUrl}/api/auth/register', data);
    }
}