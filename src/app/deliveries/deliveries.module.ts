import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveriesPageRoutingModule } from './deliveries-routing.module';

import { DeliveriesPage } from './deliveries.page';
import { BarplotComponent } from './barplot/barplot.component';
import { DeliveryFilterModalPage } from './delivery-filter-modal/delivery-filter-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveriesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DeliveriesPage, BarplotComponent, DeliveryFilterModalPage],
  exports: [DeliveryFilterModalPage]
})
export class DeliveriesPageModule {}
