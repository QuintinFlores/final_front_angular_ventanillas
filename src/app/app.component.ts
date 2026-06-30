import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // 1. ASEGURA ESTA IMPORTACIÓN

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // 2. ASEGURA QUE ESTÉ AQUÍ ADENTRO
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front_final_ventanilla';
}

