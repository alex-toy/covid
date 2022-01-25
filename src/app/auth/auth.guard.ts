import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => !isAuthenticated ? this.authService.autoLogin() :  of(isAuthenticated) ),
      tap(isAuthenticated => {
        if (!isAuthenticated) { this.router.navigateByUrl('/auth'); }
      })
    );
  }
}
