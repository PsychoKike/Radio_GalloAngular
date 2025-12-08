import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZerobounceService {

  private apiUrl = 'http://localhost:3000/api'; // tu backend

  constructor(private http: HttpClient) {}

  validateEmail(email: string) {
    // CORRECCIÓN: Usar backticks (`) en lugar de comillas simples o nada
    return this.http.get(`${this.apiUrl}/validate-email`, {
      params: { email }
    });
  }
}