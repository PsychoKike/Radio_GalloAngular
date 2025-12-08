import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotiServiceService {
  private clientId = 'fc4741164ef54cc4b09152c8c8c6a1bf'; 
  private redirectUri = 'https://localhost:4200/'; 
  
  // ✅ CORRECCIÓN FINAL: Usar el endpoint real de AUTENTICACIÓN de Spotify (HTTPS)
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  // ✅ CORRECCIÓN FINAL: Usar el endpoint real de la API de Spotify (HTTPS)
  private apiEndpoint = 'https://api.spotify.com/v1';

  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const savedToken = localStorage.getItem('spotify_token');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  login() {
    // ... (el resto del método login es correcto)
    const scopes = [
        'user-read-private',
        'user-read-email'
    ];
    
    const params = new URLSearchParams({
        client_id: this.clientId,
        response_type: 'token',
        redirect_uri: this.redirectUri,
        scope: scopes.join(' '),
        show_dialog: 'true'
    });

    const url = `${this.authEndpoint}?${params.toString()}`;
    console.log("🔗 CLIC AQUÍ SI NO REDIRIGE:", url);
    window.location.href = url;
  }

  setToken(token: string) {
    this.tokenSubject.next(token);
    localStorage.setItem('spotify_token', token);
  }

  getToken() {
    return this.tokenSubject.asObservable();
  }

  searchTracks(query: string): Observable<any> {
    const token = this.tokenSubject.value;
    if (!token) return new Observable(); 

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const safeQuery = encodeURIComponent(query);
    
    return this.http.get(`${this.apiEndpoint}/search?q=${safeQuery}&type=track&limit=5`, { headers });
  }
}