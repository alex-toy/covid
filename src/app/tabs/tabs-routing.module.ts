import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'deliveries',
        loadChildren: () => import('../deliveries/deliveries.module').then(m => m.DeliveriesPageModule)
      },
      {
        path: 'places',
        loadChildren: () => import('../places/places.module').then(m => m.PlacesPageModule)
      },
      {
        path: '',
        redirectTo: '/deliveries',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
