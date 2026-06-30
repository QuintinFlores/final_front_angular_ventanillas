import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Obligatorio para usar [(ngModel)] y *ngIf
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Variables que se enlazan con el formulario HTML
  username: string = '';
  password_hash: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    // Validamos que el operador no envíe campos vacíos
    if (!this.username || !this.password_hash) {
      this.errorMessage = 'Por favor, rellene todos los campos.';
      return;
    }

    // Enviamos los datos a Laravel a través de nuestro servicio
    this.authService.login({ username: this.username, password_hash: this.password_hash }).subscribe({
      next: (response) => {
        console.log('¡Login exitoso en Angular!', response);
        // Al recibir el Token Bearer, navegamos directo al Dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al intentar iniciar sesión:', err);
        // Si las credenciales fallan, mostramos el mensaje que programamos en Laravel
        this.errorMessage = err.error?.mensaje || 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }
}
