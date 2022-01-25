import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlobalFrancePageRoutingModule } from './global-france-routing.module';

import { GlobalFrancePage } from './global-france.page';
import { GraphComponent } from './graph/graph.component';
import { GlobalFilterModalPage } from './global-filter-modal/global-filter-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlobalFrancePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [GlobalFrancePage, GraphComponent, GlobalFilterModalPage],
  exports: [GlobalFilterModalPage]
})
export class GlobalFrancePageModule {}
