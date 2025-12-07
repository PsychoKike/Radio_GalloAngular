import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioMixerService {
  private audioContext: AudioContext;
  private mediaStreamDestination: MediaStreamAudioDestinationNode;
  
  // Para el Vúmetro
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;

  // Para la Transmisión
  private socket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  // Referencias de fuentes
  private currentMicSource: MediaStreamAudioSourceNode | null = null;
  private currentSysSource: MediaStreamAudioSourceNode | null = null;

  private mixGain: GainNode;
  private micGain: GainNode;
  private sysGain: GainNode;

  constructor() {
    // 🛠️ CORRECCIÓN 1: Verificar soporte
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    this.micGain = this.audioContext.createGain();
    this.sysGain = this.audioContext.createGain();
    this.mixGain = this.audioContext.createGain();
    
    this.mixGain.gain.value = 1.0;
    this.micGain.gain.value = 1.0;
    this.sysGain.gain.value = 1.0;


    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.mediaStreamDestination = this.audioContext.createMediaStreamDestination();

    // Conexiones permanentes
    this.micGain.connect(this.mixGain);
    this.sysGain.connect(this.mixGain);
    this.mixGain.connect(this.analyser);
    this.analyser.connect(this.mediaStreamDestination);
  }

  //Controladores de Volumen
  setMicVolume(porcentaje: number){
    const volume=Math.max(0,Math.min(1,porcentaje/100));
    this.micGain.gain.setValueAtTime(volume,this.audioContext.currentTime);
  }

  setMusicVolume(porcentaje: number){
    const volume=Math.max(0,Math.min(1,porcentaje/100));
    this.sysGain.gain.setValueAtTime(volume,this.audioContext.currentTime);
  }

  // --- 1. SELECCIÓN DE MICRÓFONOS ---
  async getInputDevices(): Promise<MediaDeviceInfo[]> {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput');
  }

  async connectMicrophone(deviceId: string) {
    // 🛠️ CORRECCIÓN 2: Asegurar que el contexto esté corriendo
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Si ya hay un micro, lo desconectamos pero SOLO ese nodo
    if (this.currentMicSource) { 
      this.currentMicSource.disconnect(); 
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: false,
          autoGainControl: true,
          noiseSuppression: false // A veces ayuda a que no corte audio
        }
      });

      this.currentMicSource = this.audioContext.createMediaStreamSource(stream);
      this.currentMicSource.connect(this.micGain);
      console.log("🎤 Micrófono conectado y enrutado");
      return true;
    } catch (error) {
      console.error('Error mic:', error);
      return false;
    }
  }

  // --- 2. AUDIO DEL SISTEMA ---
  async connectApplicationAudio() {
    if (this.audioContext.state === 'suspended') await this.audioContext.resume();

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Necesario para compartir audio de pestaña en muchos navegadores
        audio: {
          echoCancellation:false,
          noiseSuppression:false,
          autoGainControl:false,
          channelCount:2
        }
      });

      // Truco: Detener el video inmediatamente para ahorrar recursos, quedándonos solo con el audio
      stream.getVideoTracks().forEach(track => track.stop());

      if (stream.getAudioTracks().length === 0) {
        alert("No compartiste audio.");
        return false;
      }

      if (this.currentSysSource) { this.currentSysSource.disconnect(); }

      this.currentSysSource = this.audioContext.createMediaStreamSource(stream);
      this.currentSysSource.connect(this.sysGain);
      this.sysGain.gain.value = 0.7;
      return true;
    } catch (error) {
      console.error('Error app audio:', error);
      return false;
    }
  }

  // --- 3. VÚMETRO ---
  getVolumeLevel(): number {
    this.analyser.getByteTimeDomainData(this.dataArray as any);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] - 128;
      sum += Math.abs(v);
    }
    const avg = sum / this.dataArray.length;
    return Math.min(100, (avg / 20) * 100);
  }

  // --- 4. TRANSMISIÓN ---
  async startStreaming() {
    // 🛠️ CORRECCIÓN 3: Reanudar contexto siempre antes de transmitir
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const UBUNTU_IP = '192.168.1.9';
    const PORT = '3000';

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(`ws://${UBUNTU_IP}:${PORT}`);
    }

    this.socket.onopen = () => {
      console.log('✅ Conectado al Socket');
      
      // Usamos el stream del destino (que ya tiene la mezcla)
      const mixedStream = this.mediaStreamDestination.stream;
      
      try {
         // 🛠️ CORRECCIÓN 4: Definir un mimeType seguro si es posible, o dejar default
        const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? { mimeType: 'audio/webm;codecs=opus' } 
          : undefined;

        this.mediaRecorder = new MediaRecorder(mixedStream, options);
      } catch (e) {
        console.error('Error MediaRecorder:', e);
        return;
      }

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(event.data);
        }
      };

      // Enviar trozos pequeños (100ms es mejor para tiempo real que 250ms)
      this.mediaRecorder.start(100); 
      console.log('🚀 Transmitiendo...');
    };

    this.socket.onerror = (err) => console.error('Socket Error:', err);
  }

  stopStreaming() {
    // 🛠️ CORRECCIÓN 5: IMPORTANTE
    // Aquí SOLO detenemos la grabación y el socket.
    // NO detenemos el micrófono (tracks). Si lo hacemos, el usuario tendría
    // que volver a seleccionar el micrófono para volver a hablar.

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log("⏹️ Grabadora detenida");
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log("🔌 Socket cerrado");
    }

    // NO LLAMAMOS A cleanupStreams() AQUÍ.
    // Eso mataba tu audio para la siguiente vez.
  }

  // Este método solo deberías llamarlo si sales de la página (ngOnDestroy)
  disconnectEverything() {
    this.stopStreaming();
    
    if (this.currentMicSource) {
      this.currentMicSource.mediaStream.getTracks().forEach(t => t.stop());
      this.currentMicSource.disconnect();
    }
    if (this.currentSysSource) {
      this.currentSysSource.mediaStream.getTracks().forEach(t => t.stop());
      this.currentSysSource.disconnect();
    }
    // Cerramos el contexto si ya no se usa la app
    this.audioContext.close();
  }
}