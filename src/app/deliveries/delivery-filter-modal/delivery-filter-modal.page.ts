import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delivery-filter-modal',
  templateUrl: './delivery-filter-modal.page.html',
  styleUrls: ['./delivery-filter-modal.page.scss'],
})
export class DeliveryFilterModalPage implements OnInit {
  form: FormGroup;

  constructor(
    public modalCtrl: ModalController,
  ) {}  
  
  ngOnInit() {
    this.form = new FormGroup({
      regionName: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      latitude: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.min(-50), Validators.max(50)]
      }),
      longitude: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.min(-50), Validators.max(50)]
      }),
      distance: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.min(0)]
      }),
    });
  }

  async dismiss() {
    if (!this.form.valid) { return; }
    
    await this.modalCtrl.dismiss({ 
      regionName : this.form.value.regionName,
      latitude : this.form.value.latitude,
      longitude : this.form.value.longitude,
      distance : this.form.value.distance,
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}

