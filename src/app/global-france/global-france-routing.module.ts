import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalFrancePage } from './global-france.page';

const routes: Routes = [
  {
    path: '',
    component: GlobalFrancePage
  },
  {
    path: 'select/:recordId',
    loadChildren: () => import('./record-detail/record-detail.module').then( m => m.RecordDetailPageModule)
  },
  {
    path: 'global-filter-modal',
    loadChildren: () => import('./global-filter-modal/global-filter-modal.module').then( m => m.GlobalFilterModalPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalFrancePageRoutingModule {}
