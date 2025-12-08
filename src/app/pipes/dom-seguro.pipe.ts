import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'domSeguro',
  standalone:true
})
export class DomSeguroPipe implements PipeTransform {
constructor(private domSanitizer: DomSanitizer) {}

  transform(value: string): SafeResourceUrl {
    // Esta es la URL mágica que usa el video para el Widget
    // value será el ID de la canción
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
