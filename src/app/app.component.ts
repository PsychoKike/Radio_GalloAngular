import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { ListaLocComponent } from "./lista-loc/lista-loc.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, DashboardComponent, LoginComponent, RegistroComponent, RouterLink, LoginComponent, ListaLocComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'radiogallo';
}
