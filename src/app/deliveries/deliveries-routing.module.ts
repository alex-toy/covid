import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveriesPage } from './deliveries.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveriesPage
  },

  {
    path: 'select/:deliveryId',
    loadChildren: () => import('./delivery-detail/delivery-detail.module').then( m => m.DeliveryDetailPageModule)
  },
  {
    path: 'delivery-filter-modal',
    loadChildren: () => import('./delivery-filter-modal/delivery-filter-modal.module').then( m => m.DeliveryFilterModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveriesPageRoutingModule {}
