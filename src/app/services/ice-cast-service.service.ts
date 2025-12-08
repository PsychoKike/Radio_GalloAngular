import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IceCastServiceService {
// ⚠️ Verifica que esta sea tu IP correcta
// Verifica que esta IP sea accesible desde tu navegador
  private ICECAST_URL = 'http://192.168.193.146:8000/status-json.xsl'; 

  constructor(private http: HttpClient) { }

getListeners() {
    return this.http.get<any>(this.ICECAST_URL).pipe(
      map(res => {
        const source = res.icestats?.source;

        if (!source) return 0;

        // Si hay varios mountpoints, buscamos /radio
        if (Array.isArray(source)) {
          const radio = source.find((s: any) => s.listenurl.includes("/radio"));
          return radio ? radio.listeners : 0;
        }

        // Si es único mountpoint
        return source.listeners ?? 0;
      }),
      catchError(() => of(0)) // Si falla, offline
    );
  }
}
