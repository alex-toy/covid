import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryFilterModalPage } from './delivery-filter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryFilterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryFilterModalPageRoutingModule {}
