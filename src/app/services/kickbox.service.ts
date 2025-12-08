import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KickboxService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  validateEmail(email: string) {
    return this.http.get('${this.apiUrl}/validate-email', {
      params: { email }
    });
  }
}