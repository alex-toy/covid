import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalFilterModalPage } from './global-filter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GlobalFilterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalFilterModalPageRoutingModule {}
