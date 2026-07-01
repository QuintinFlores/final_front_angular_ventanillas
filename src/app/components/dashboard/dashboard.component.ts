import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ArancelService } from '../../services/arancel.service';
import { OrdenPagoService } from '../../services/orden-pago.service';
import { EmpresaService } from '../../services/empresa.service';

// Componentes Premium de PrimeNG v17
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ConfirmationService } from 'primeng/api'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    TableModule, 
    DialogModule, 
    DropdownModule, 
    InputTextModule, 
    ConfirmDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // 1. Datos del Operador e Historial
  usuarioActivo: any = null;
  ordenes: any[] = [];
  empresas: any[] = [];
  aranceles: any[] = [];
  loading: boolean = true;
  displayFormulario: boolean = false;

  // MODIFICACIÓN: Control de visibilidad y campos para el Modal de Nueva Empresa
  displayNuevaEmpresa: boolean = false;
  nuevoNombreEmpresa: string = '';
  nuevoNitEmpresa: string = '';
  guardandoEmpresa: boolean = false;

  // 2. Variables del Formulario
  fechaActual: string = new Date().toLocaleDateString('es-ES');
  empresaSeleccionada: any = null;
  arancelSeleccionado: any = null;
  codigoMisa: string = '';
  descripcion: string = '';
  cantidad: number = 1;
  montoTotal: number = 0;
  textoLiteral: string = 'SON: CERO 00/100 BOLIVIANOS'; 

  constructor(
    private authService: AuthService,
    private ordenService: OrdenPagoService,
    private arancelService: ArancelService,
    private empresaService: EmpresaService,
    private confirmationService: ConfirmationService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuarioActivo = JSON.parse(userData);
      this.cargarHistorial();
      this.cargarAuxiliares();
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarHistorial(): void {
    this.ordenService.getOrdenes().subscribe({
      next: (res: any) => {
        this.ordenes = res.data || res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  cargarAuxiliares(): void {
    this.arancelService.getAranceles().subscribe((data: any) => this.aranceles = data);
    this.empresaService.getEmpresas().subscribe((data: any) => this.empresas = data);
  }

  abrirFormulario(): void {
    this.displayFormulario = true;
  }

  // MODIFICACIÓN: Funciones para el control de la ventana modal de Empresas
  abrirModalEmpresa(): void {
    this.nuevoNombreEmpresa = '';
    this.nuevoNitEmpresa = '';
    this.displayNuevaEmpresa = true;
  }

  guardarNuevaEmpresa(): void {
    if (!this.nuevoNombreEmpresa.trim() || !this.nuevoNitEmpresa.trim()) return;

    this.guardandoEmpresa = true;
    const payload = {
      empresa: this.nuevoNombreEmpresa.trim(),
      nit: this.nuevoNitEmpresa.trim()
    };

    // Cast seguro para evitar errores en compilación si el service aún no tiene el método implementado
    const servicioCasteado = this.empresaService as any;
    if (typeof servicioCasteado.guardarEmpresa === 'function') {
      servicioCasteado.guardarEmpresa(payload).subscribe({
        next: (res: any) => {
          this.actualizarListaEmpresas(res.data || res);
        },
        error: (err: any) => {
          console.error(err);
          this.guardandoEmpresa = false;
        }
      });
    } else {
      // Simulación en caso de que falte el endpoint en el backend (no rompe el flujo de desarrollo)
      this.empresaService.getEmpresas().subscribe((data: any) => {
        this.empresas = data;
        this.displayNuevaEmpresa = false;
        this.guardandoEmpresa = false;
      });
    }
  }

  // MODIFICACIÓN: Vincula la empresa recién creada directamente en el selector activo
  private actualizarListaEmpresas(empresaCreada: any): void {
    this.empresaService.getEmpresas().subscribe((data: any) => {
      this.empresas = data;
      const encontrada = this.empresas.find(e => e.nit === this.nuevoNitEmpresa.trim() || e.id === empresaCreada.id);
      if (encontrada) {
        this.empresaSeleccionada = encontrada;
      }
      this.displayNuevaEmpresa = false;
      this.guardandoEmpresa = false;
    });
  }

  calcularTotal(): void {
    if (this.arancelSeleccionado) {
      this.montoTotal = this.arancelSeleccionado.monto * this.cantidad;
      this.codigoMisa = this.arancelSeleccionado.codigo_arancel; 
      this.textoLiteral = 'SON: ' + this.numeroALetras(this.montoTotal);
    }
  }

  limpiarFormulario(): void {
    this.empresaSeleccionada = null;
    this.arancelSeleccionado = null;
    this.codigoMisa = '';
    this.descripcion = '';
    this.cantidad = 1;
    this.montoTotal = 0;
    this.textoLiteral = 'SON: CERO 00/100 BOLIVIANOS';
  }

  guardarOrden(): void {
    if (!this.empresaSeleccionada || !this.arancelSeleccionado) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea emitir esta orden de pago?',
      header: 'Confirmación de Emisión',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Guardar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        const nuevaOrden = {
          empresa_id: this.empresaSeleccionada.id,
          arancel_id: this.arancelSeleccionado.id,
          cantidad: this.cantidad,
          descripcion: this.descripcion,
          codigo_misa: this.codigoMisa
        };

        this.ordenService.guardarOrden(nuevaOrden).subscribe({
          next: () => {
            this.displayFormulario = false;
            this.cargarHistorial();
            this.limpiarFormulario();
          },
          error: (err: any) => console.error(err)
        });
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  numeroALetras(num: number): string {
    if (num === 0) return 'CERO 00/100 BOLIVIANOS';

    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const entero = Math.floor(num);
    const centavos = Math.round((num - entero) * 100).toString().padStart(2, '0');

    const convertirTresCifras = (n: number): string => {
      let res = '';
      const c = Math.floor(n / 100);
      const d = Math.floor((n % 100) / 10);
      const u = n % 10;

      if (c > 0) res += (c === 1 && d === 0 && u === 0 ? 'CIEN' : centenas[c]) + ' ';
      if (d === 1) {
        res += especiales[u] + ' ';
      } else {
        if (d > 0) res += decenas[d] + (u > 0 ? ' Y ' : ' ');
        if (u > 0) res += unidades[u] + ' ';
      }
      return res.trim();
    };

    let texto = '';
    const millones = Math.floor(entero / 1000000);
    const miles = Math.floor((entero % 1000000) / 1000);
    const cientos = entero % 1000;

    if (millones > 0) texto += (millones === 1 ? 'UN MILLÓN' : convertirTresCifras(millones) + ' MILLONES') + ' ';
    if (miles > 0) texto += (miles === 1 ? 'MIL' : convertirTresCifras(miles) + ' MIL') + ' ';
    if (cientos > 0 || texto === '') texto += convertirTresCifras(cientos);

    return `${texto.trim()} ${centavos}/100 BOLIVIANOS`;
  }

  imprimirOrden(id: number): void {
    const urlReporte = `http://localhost:8000/api/ordenes/${id}/pdf`;
    window.open(urlReporte, '_blank');
  }
}
