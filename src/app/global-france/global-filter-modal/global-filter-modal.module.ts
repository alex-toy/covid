import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlobalFilterModalPageRoutingModule } from './global-filter-modal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlobalFilterModalPageRoutingModule,
    ReactiveFormsModule
  ],
})
export class GlobalFilterModalPageModule {}
