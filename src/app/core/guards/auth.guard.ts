import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  auth = inject(Auth);
  router = inject(Router);

  canActivate() {
    return authState(this.auth).pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
