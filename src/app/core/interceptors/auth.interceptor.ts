import { HttpInterceptorFn } from '@angular/common/http';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inizializza Firebase se non ancora fatto
  if (!getApps().length) {
    initializeApp(environment.firebaseConfig);
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return next(req);
  }

  return from(user.getIdToken()).pipe(
    switchMap((token) => {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(cloned);
    })
  );
};
