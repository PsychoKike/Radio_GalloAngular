
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Asegúrate de que este puerto coincida con tu Express (3000 si está en el mismo host)
    // O usa la IP/Puerto que usaste: http://192.168.193.146:8888 o http://192.168.193.146:3000
    private baseUrl = 'http://192.168.193.146:3000'; // Ajusta el puerto a 3000 si ahí corre Express

    constructor(private http: HttpClient) { }

    // 1. FUNCIÓN PARA EL LOGIN (Mantiene el mismo endpoint, pero ahora devuelve el rol)
    login(credentials: any): Observable<any> {
        // EL SERVIDOR YA LO TIENE EN /api/auth/login
        return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
    }

    // 2. FUNCIÓN UNIVERSAL DE REGISTRO (Nueva ruta en el servidor: /api/auth/register)
    // El objeto 'data' debe incluir la propiedad 'rol'.
    register(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/auth/register`, data);
    }
}


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthService {
//     // Asegúrate de que este puerto coincida con tu Express (3000 si está en el mismo host)
//     // O usa la IP/Puerto que usaste: http://192.168.193.146:8888 o http://192.168.193.146:3000
//     private baseUrl = 'http://192.168.193.146:3000'; // Ajusta el puerto a 3000 si ahí corre Express

//     constructor(private http: HttpClient) { }

//     // 1. FUNCIÓN PARA EL LOGIN (Mantiene el mismo endpoint, pero ahora devuelve el rol)
//     login(credentials: any): Observable<any> {
//         // EL SERVIDOR YA LO TIENE EN /api/auth/login
//         return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
//     }

//     // 2. FUNCIÓN UNIVERSAL DE REGISTRO (Nueva ruta en el servidor: /api/auth/register)
//     // El objeto 'data' debe incluir la propiedad 'rol'.
//     register(data: any): Observable<any> {
//         return this.http.post(`${this.baseUrl}/api/auth/register`, data);
//     }
// }