import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Connexion en cours...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs = this.callAuthService(email, password);
        authObs.subscribe(
          _ => {
            loadingEl.dismiss();
            this.handleOKResponse();
          },
          errRes => { 
            loadingEl.dismiss();
            this.handleErrorResponse(errRes);
          }
        );
      });
  }

  callAuthService(email: string, password: string) : Observable<AuthResponseData> {
    if (this.isLogin) {
      return this.authService.login(email, password);
    } else {
      return this.authService.signup(email, password);
    }
  }

  handleOKResponse(){
    this.isLoading = false;
    this.router.navigateByUrl('/splash');
  }

  handleErrorResponse(errRes){
    const code = errRes.error.error.message;
    //Messages d'erreur : https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    let message = 'Création impossible, merci de réessayer.';
    if (code === 'EMAIL_EXISTS') {
      message = 'Cette adresse mail existe déjà.';
    } else if (code === 'EMAIL_NOT_FOUND') {
      message = 'Cette adresse mail est introuvable.';
    } else if (code === 'INVALID_PASSWORD') {
      message = 'Le mot de passe est incorrect.';
    }
    this.showAlert(message);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { return; }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: this.isLogin ? 'L\'authentication a échoué' : "La création a échoué",
        message: message,
        buttons: ['Ok']
      })
      .then(alertEl => alertEl.present());
  }
}
