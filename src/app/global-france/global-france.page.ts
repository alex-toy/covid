import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { GlobalFilterModalPage } from './global-filter-modal/global-filter-modal.page';
import { Record } from './record.model';
import { RecordService } from './record.service';

@Component({
  selector: 'app-global-france',
  templateUrl: './global-france.page.html',
  styleUrls: ['./global-france.page.scss'],
})
export class GlobalFrancePage implements OnInit {

  isLoading = false;
  private sub: Subscription;
  records: Record[];
  currentRecord: Record[];
  mode : string = "list";
  regionName : string;
  longitude : number;
  latitude : number;
  distance : number;
  rows : number;
  start : number;
  buttonRange : number[]
  itemsPerPage : number;

  constructor(
    private recordService: RecordService,
    public modalCtrl: ModalController,
    private localStorageService : LocalStorageService
  ) {}

  ngOnInit() {
    this.getConfig();
    this.sub = this.recordService.records.subscribe(records => {
      this.records = records;
      this.buttonRange = this.getPagination(this.records.length, this.itemsPerPage);
      this.onSelectPage(1);
    });
  }

  getPagination(nbItems :number, itemsPerPage : number) : number[] {
    let nbPages = Math.floor(nbItems / itemsPerPage);
    nbPages = itemsPerPage*nbPages < nbItems ? nbPages+1 : nbPages;
    return Array.from(Array(nbPages).keys()).map(x => x + 1);
  }

  getConfig(){
    this.start = this.localStorageService.getItem("offset") ?? 0;
    this.rows = this.localStorageService.getItem("numberOfRows") ?? 10;
    this.itemsPerPage = this.localStorageService.getItem("itemsPerPage") ?? 10;
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: GlobalFilterModalPage
    });
    modal.onDidDismiss().then(dataReturned => {
      let data = dataReturned.data;
      if(data){
        this.regionName = data.regionName ? data.regionName : "";
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.distance = data.distance;
        this.loadData();
      }
    });
    return await modal.present();
  }

  loadData(){
    this.isLoading = true;
    this.recordService.fetchAll(
      this.regionName, this.rows, this.start, 
      this.latitude, this.longitude, this.distance
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  public changeMode(event) {
    this.mode = event.detail.value;
  }

  onSelectPage(index) {
    this.currentRecord = this.records.map(p=>p).splice((index-1)*this.itemsPerPage, this.itemsPerPage);
  }
}
