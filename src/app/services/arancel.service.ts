import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArancelService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los aranceles pasándole el token guardado en el login
  getAranceles(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/aranceles`, { headers });
  }
}
