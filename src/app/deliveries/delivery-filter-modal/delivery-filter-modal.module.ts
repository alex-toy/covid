import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryFilterModalPageRoutingModule } from './delivery-filter-modal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryFilterModalPageRoutingModule,
    ReactiveFormsModule
  ]
})
export class DeliveryFilterModalPageModule {}
