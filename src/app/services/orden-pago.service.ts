import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenPagoService {
  private apiUrl = 'http://localhost:8000/api/ordenes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Trae el historial de órdenes para la tabla principal
  getOrdenes(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Guarda una nueva orden desde el formulario
  guardarOrden(orden: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orden, { headers: this.getHeaders() });
  }

  // FUNCIÓN PARA EXCEL: Llama a Laravel de forma segura
  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar/excel`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}

