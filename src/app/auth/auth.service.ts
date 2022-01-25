import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from './user.model';
import { CheckConnectionService } from '../check-connection.service';
import { LocalStorageService } from '../local-storage.service';

// Interface mapping structure from https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface AuthData {
  token: string;
  tokenExpirationDate: string;
  userId: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  
  signInUrl = `${environment.signInUrlFirebase}${environment.firebaseAPIKey}`;
  signUpUrl = `${environment.signUpUrlFirebase}${environment.firebaseAPIKey}`;

  constructor(
    private http: HttpClient,
    private checker : CheckConnectionService,
    private localStorageService : LocalStorageService,
  ) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => user ? !!user.token : false)
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => user ? user.id : null)
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => user ? user.token : null )
    );
  }

  signup(email: string, password: string) {
    this.checker.handleConnection();
    return this.http.post<AuthResponseData>(
      this.signUpUrl,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    this.checker.handleConnection();
    return this.http.post<AuthResponseData>(
      this.signInUrl,
      { email: email, password: password }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) { clearTimeout(this.activeLogoutTimer); }
    this._user.next(null);
    this.localStorageService.removeItem("authData");
  }

  autoLogin() {
    const authData : Observable<string> = of(this.localStorageService.getItem("authData"))
    return from(authData).pipe(
      map(storedData => {
        if (!storedData) { return null; }
        const parsedData = JSON.parse(storedData) as AuthData;
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {  return null; }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => !!user )
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    this.localStorageService.setItem("authData",  data);
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const remainingTime = this.localStorageService.getItem("nbSecondsBeforeDecconnexion");
    let expiresIn = userData.expiresIn ? +userData.expiresIn : remainingTime;
    const expirationTime = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }
}