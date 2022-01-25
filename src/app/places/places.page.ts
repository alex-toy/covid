import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from '../local-storage.service';
import { Place } from './place.model';
import { PlaceService } from './place.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {
  isLoading = false;
  private sub: Subscription;
  places: Place[];
  currentPlaces: Place[];
  mode : string = "list";
  cp: number = 1;
  regionName : string;
  rows : number;
  start : number;
  buttonRange : number[]
  itemsPerPage : number;

  constructor(
    private placesService: PlaceService,
    private localStorageService : LocalStorageService,
  ) {}

  ngOnInit() {
    this.regionName = "";
    this.getConfig();
    this.sub = this.placesService.places.subscribe(places => {
      this.places = places;
      this.buttonRange = this.getPagination(this.places.length, this.itemsPerPage);
      this.onSelectPage(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.getConfig();
    this.placesService.fetchAll(this.regionName, this.rows, this.start).subscribe(() => {
      this.isLoading = false;
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

  public changeMode(event) {
    this.mode = event.detail.value;
  }

  onSelectPage(index) {
    this.currentPlaces = this.places.map(p=>p).splice((index-1)*this.itemsPerPage, this.itemsPerPage);
  }
}
