import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioMixerService } from '../services/audio-mixer.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GraficaEscuchasComponent } from "../grafica-escuchas/grafica-escuchas.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpotiServiceService } from '../services/spoti-service.service';
import { DomSeguroPipe } from '../pipes/dom-seguro.pipe';
import { ClimaService } from '../services/clima.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, CommonModule, GraficaEscuchasComponent, DomSeguroPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit, OnDestroy {
availableMics: MediaDeviceInfo[] = [];
  selectedMicId: string = '';
  
  micActive = false;
  musicActive = false;
  volumeLevel = 0; 
  isTransmitting = false;
  musiVol=100;
  VozVol=100;


  //Clima 
  climaData:any;
  currentDate=new Date();
  protected Math=Math;

  //Variables de Spotify
  spotifyToken: string | null = null;
  searchQuery: string = '';
  searchResults: any[] = [];
  currentTrackUrl: string | null = null; // URL segura para el iframe


  constructor(private climaservice:ClimaService,private mixer: AudioMixerService, private Spotify: SpotiServiceService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  
  ngOnDestroy(): void {
   this.mixer.disconnectEverything();
  }

  async ngOnInit() {
    this.availableMics = await this.mixer.getInputDevices();
    if (this.availableMics.length > 0) {
      this.selectedMicId = this.availableMics[0].deviceId;
    }

    this.getClima('Aguascalientes, MX');

    // También actualizamos el intervalo para que siga checando Aguascalientes
    setInterval(() => {
      this.getClima('Aguascalientes, MX');
    }, 600000); // Cada 10 min
  }

  getClima(city: string){
    this.climaservice.getClima(city).subscribe({
      next: (data) => {
        this.climaData = data;
        console.log('Datos del clima:', data);
      },
      error: (error) => {
        console.error('Error obteniendo clima:', error);
      }
    });
  }


  // --- LÓGICA SPOTIFY ---

checkSpotifyToken() {
    // 1. Verificar URL (Callback) cuando Spotify te devuelve a tu página
    const fragment = window.location.hash; 
    if (fragment && fragment.includes('access_token')) {
      const params = new URLSearchParams(fragment.substring(1)); 
      const token = params.get('access_token');
      if (token) {
        this.Spotify.setToken(token);
        // Limpiar URL para que se vea bonita (quita el token de la barra de direcciones)
        window.history.pushState("", document.title, window.location.pathname);
      }
    }

    // 2. Suscribirse para saber si ya tenemos token guardado
    this.Spotify.getToken().subscribe(token => {
      this.spotifyToken = token;
    });
  }

  loginSpotify() {
    this.Spotify.login();
  }

  searchMusic() {
    if (!this.searchQuery) return;
    
    // Si no hay token, forzamos login antes de buscar
    if (!this.spotifyToken) {
        this.loginSpotify();
        return;
    }
    
    this.Spotify.searchTracks(this.searchQuery).subscribe({
      next: (data: any) => {
        this.searchResults = data.tracks.items;
      },
      error: (err) => {
        console.error('Error buscando', err);
        // Si el error es 401 (Token vencido), mandamos al login de nuevo
        if (err.status === 401) this.Spotify.login();
      }
    });
  }

  // En DashboardComponent

playTrack(trackId: string) {
  // 🟢 CORRECCIÓN: Usar la URL y sintaxis correctas para el embed
  // Debe ser HTTPS y se construye el path con el ID de la pista.
  const url = `https://open.spotify.com/embed/track/$${trackId}?utm_source=generator&theme=0`;
  this.currentTrackUrl = url;
}

  updateMicVolume(){
    this.mixer.setMicVolume(this.VozVol)
  }

  
  updateMusicVolume(){
    this.mixer.setMusicVolume(this.musiVol)
  }

  async onMicChange() {
    if (this.selectedMicId) {
      const success = await this.mixer.connectMicrophone(this.selectedMicId);
      if (success) {
        this.micActive = true;
        this.startVisualizer(); 
      }
    }
  }

  async openAppSelector() {
    const success = await this.mixer.connectApplicationAudio();
    if (success) {
      this.musicActive = true;
      this.startVisualizer();
    }
  }

  toggleTransmission() {
    if (!this.isTransmitting) {
      this.mixer.startStreaming();
      this.isTransmitting = true;
    } else {
      this.mixer.stopStreaming();
      this.isTransmitting = false;
    }
  }

  startVisualizer() {
    const animate = () => {
      this.volumeLevel = this.mixer.getVolumeLevel();
      requestAnimationFrame(animate);
    };
    animate();
  }
  
}
