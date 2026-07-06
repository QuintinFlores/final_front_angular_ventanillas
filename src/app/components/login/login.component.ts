import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxParticlesModule, NgParticlesService } from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';
import { MoveDirection, OutMode } from '@tsparticles/engine';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NgxParticlesModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  showPassword = signal(false);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  particlesId = 'tsparticles-brand';

  particlesOptions = {
    background: {
      color: {
        value: "transparent"
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        resize: {
          enable: true
        }
      }
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          area: 800
        }
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 1,
          sync: false
        }
      },
      opacity: {
        value: 0.5
      },
      links: {
        enable: true,
        distance: 120,
        color: "#ffffff",
        opacity: 0.2,
        width: 0.5
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none" as MoveDirection,
        random: false,
        straight: false,
        outModes: {
          default: "out" as OutMode
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private particlesService: NgParticlesService
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      recordar: [false]
    });
  }

  ngOnInit(): void {
    this.particlesService.init(async (engine) => {
      await loadSlim(engine);
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMsg.set(null);
    this.loading.set(true);

    const { usuario, password } = this.form.value;

    this.authService.login({ username: usuario, password_hash: password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.error?.message ?? 'Usuario o contraseña incorrectos. Intente nuevamente.'
        );
      }
    });
  }
}
