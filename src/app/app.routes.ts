import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Ajustado con el punto oficial

export const routes: Routes = [
  // 1. Si la URL está vacía, redirige automáticamente al Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Ruta para la pantalla de acceso
  { path: 'login', component: LoginComponent },
  
  // 3. Ruta para el panel principal de control
  { path: 'dashboard', component: DashboardComponent },
  
  // 4. Ruta comodín por si escriben cualquier cosa, manda al login
  { path: '**', redirectTo: 'login' }
];
