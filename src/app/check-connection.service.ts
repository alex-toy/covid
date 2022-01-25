import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckConnectionService {

  constructor(
    private alertCtrl: AlertController
  ) { }

  handleConnection(){
    // console.log('connexion', navigator.onLine)
    if(!navigator.onLine) {
      this.showAlert("Veuillez vérifier votre connexion réseau.");
    }
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header:  "Hors connexion",
        message: message,
        buttons: ['Ok']
      })
      .then(alertEl => alertEl.present());
  }
}
