import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que este puerto coincida con tu Spring Boot (8080 o 3000)
  private apiUrl = 'http://192.168.50.178:8080/api/auth/login'; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
