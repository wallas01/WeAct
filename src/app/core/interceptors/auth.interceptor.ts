import { HttpInterceptorFn } from '@angular/common/http';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

function getCurrentUser(): Promise<User | null> {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // inizializza Firebase se non ancora fatto
  if (!getApps().length) {
    initializeApp(environment.firebaseConfig);
  }

  return from(getCurrentUser()).pipe(
    switchMap((user) => {
      if (!user) {
        return next(req).pipe(
          catchError((err) => {
            if (err.status === 401) {
              router.navigate(['/login']);
            }
            return throwError(() => err);
          })
        );
      }
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(cloned);
        }),
        catchError((err) => {
          if (err.status === 401) {
            router.navigate(['/login']);
          }
          return throwError(() => err);
        })
      );
    })
  );
};
