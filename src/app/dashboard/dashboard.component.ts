import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioMixerService } from '../services/audio-mixer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
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

  constructor(private mixer: AudioMixerService) {}
  ngOnDestroy(): void {
   this.mixer.disconnectEverything();
  }

  async ngOnInit() {
    this.availableMics = await this.mixer.getInputDevices();
    if (this.availableMics.length > 0) {
      this.selectedMicId = this.availableMics[0].deviceId;
    }
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
