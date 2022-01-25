import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordDetailPageRoutingModule } from './record-detail-routing.module';

import { RecordDetailPage } from './record-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordDetailPageRoutingModule
  ],
  declarations: [RecordDetailPage]
})
export class RecordDetailPageModule {}
