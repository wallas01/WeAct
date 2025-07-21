import { Component, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Material imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(Auth);
  router = inject(Router);
  fb = new FormBuilder();
  translate = inject(TranslateService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  hide = true; // per toggle password

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await signInWithEmailAndPassword(this.auth, email!, password!);
      alert(this.translate.instant('LOGIN.SUCCESS_MESSAGE'));
      this.router.navigate(['/']);
    } catch (err) {
      alert(this.translate.instant('LOGIN.ERROR_MESSAGE') + (err as Error).message);
    }
  }

  async loginGoogle() {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      alert(this.translate.instant('LOGIN.GOOGLE_SUCCESS_MESSAGE'));
      this.router.navigate(['/']);
    } catch (err) {
      alert(this.translate.instant('LOGIN.GOOGLE_ERROR_MESSAGE') + (err as Error).message);
    }
  }
}

