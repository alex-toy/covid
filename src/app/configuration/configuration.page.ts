import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {

  form: FormGroup;

  startFlow : string;
  rows : number;
  start : number;
  itemsPerPage : number;
  nbSecondsBeforeDecconnexion : number;

  constructor(
    private localStorageService : LocalStorageService,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.getConfig();
    this.form = new FormGroup({
      numberOfRows: new FormControl(this.rows, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0), Validators.max(20)]
      }),
      offset: new FormControl(this.start, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)]
      }),
      itemsPerPage: new FormControl(this.itemsPerPage, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0), Validators.max(20)]
      }),
      startFlow: new FormControl(this.startFlow, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      nbSecondsBeforeDecconnexion: new FormControl(this.nbSecondsBeforeDecconnexion, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(15)]
      }),
    });
  }

  getConfig(){
    this.start = this.localStorageService.getItem("offset") ?? 0;
    this.rows = this.localStorageService.getItem("numberOfRows") ?? 10;
    this.itemsPerPage = this.localStorageService.getItem("itemsPerPage") ?? 10;
    this.startFlow = this.localStorageService.getItem("startFlow") ?? "places";
    this.nbSecondsBeforeDecconnexion = this.localStorageService.getItem("nbSecondsBeforeDecconnexion") ?? 150;
  }

  onValidateConfig() {
    if (!this.form.valid) {
      return;
    }
    let numberOfRows = this.form.value.numberOfRows;
    let offset = this.form.value.offset;
    let itemsPerPage = this.form.value.itemsPerPage;
    let startFlow = this.form.value.startFlow;
    let nbSecondsBeforeDecconnexion = this.form.value.nbSecondsBeforeDecconnexion;
    this.localStorageService.setItem("numberOfRows",  numberOfRows);
    this.localStorageService.setItem("offset",  offset);
    this.localStorageService.setItem("itemsPerPage",  itemsPerPage);
    this.localStorageService.setItem("startFlow",  startFlow);
    this.localStorageService.setItem("nbSecondsBeforeDecconnexion",  nbSecondsBeforeDecconnexion);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'La configuration a été réalisée!' })
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
          let url = `/${startFlow}`;
          this.router.navigateByUrl(url);
        }, 1000)
        
      });
  }
}
