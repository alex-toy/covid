import { Component, OnInit } from '@angular/core';
import { DeliveryService } from './delivery.service';
import { Delivery } from './delivery.model';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DeliveryFilterModalPage } from './delivery-filter-modal/delivery-filter-modal.page';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.page.html',
  styleUrls: ['./deliveries.page.scss'],
})
export class DeliveriesPage implements OnInit {

  isLoading = false;
  private sub: Subscription;
  deliveries: Delivery[];
  currentDeliveries: Delivery[];
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
    private deliveryService: DeliveryService,
    public modalCtrl: ModalController,
    private localStorageService : LocalStorageService
  ) {}

  ngOnInit() {
    this.regionName = "";
    this.getConfig();
    this.sub = this.deliveryService.deliveries.subscribe(deliveries => {
      this.deliveries = deliveries;
      this.buttonRange = this.getPagination(this.deliveries.length, this.itemsPerPage);
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
      component: DeliveryFilterModalPage
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
    this.deliveryService.fetchAll(
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
    this.currentDeliveries = this.deliveries.map(p=>p).splice((index-1)*this.itemsPerPage, this.itemsPerPage);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
