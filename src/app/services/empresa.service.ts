import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8000/api/empresas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Obtener la lista completa de empresas para el selector dinámico
  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // NUEVO: Método para enviar la petición POST a Laravel persistiendo en Postgres
  guardarEmpresa(datos: { empresa: string; nit: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos, { headers: this.getHeaders() });
  }
}
