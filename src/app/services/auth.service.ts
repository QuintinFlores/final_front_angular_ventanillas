import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Tu URL base del servidor local de Laravel 12
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 1. Método para enviar las credenciales a Laravel con el mapeo correcto
  login(credentials: { username: string; password_hash: string }): Observable<any> {
    // Creamos el cuerpo transformando 'password_hash' a 'password' para Laravel
    const body = {
      username: credentials.username,
      password: credentials.password_hash
    };

    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        // CAMBIA ESTAS DOS LÍNEAS PARA QUE COINCIDAN CON TU CAPTURA DE CONSOLA:
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
        }
      })
    );
  }

  // 2. Método para cerrar sesión borrando los datos locales y avisando al backend
  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    
    // Pasamos el token en las cabeceras para que Sanctum nos autorice la salida
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        // Limpiamos el navegador pase lo que pase en el servidor
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      })
    );
  }

  // 3. Método auxiliar para saber si el operador está logueado en este momento
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}


