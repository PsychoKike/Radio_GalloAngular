import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiKey = 'fea7147c8930c40816350c22121d5345';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getClima(city: string){
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`);
  }
}
