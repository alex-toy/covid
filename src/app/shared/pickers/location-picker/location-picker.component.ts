import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/places/place-detail/location.model';
import { environment } from 'src/environments/environment';

import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  @Input() coordinates : Coordinates;
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) {}

  ngOnInit() {}

  openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        console.log(modalData)
        if (!modalData.data) { return; }
        this.createPlace();
      });
      modalEl.present();
    });
  }

  private createPlace() {
    const pickedLocation: PlaceLocation = {
      lat: this.coordinates.lat,
      lng: this.coordinates.lng,
      address: null,
      staticMapImageUrl: null
    };
    this.isLoading = true;
    this.getAddress()
      .pipe(
        switchMap(address => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(14)
          );
        })
      )
      .subscribe(staticMapImageUrl => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress() {
    const lat: number = this.coordinates.lat;
    const lng: number = this.coordinates.lng;
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleAPIKey}`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) { return null; }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(zoom: number) {
    const lat: number = this.coordinates.lat;
    const lng: number = this.coordinates.lng;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleAPIKey}`;
  }
}
