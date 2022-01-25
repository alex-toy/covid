import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { CheckConnectionService } from '../check-connection.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private _places = new BehaviorSubject<Place[]>([]);
  private opendatasoftURL : string = environment.placesURL;

  get places() {
    return this._places.asObservable();
  }

  constructor(
    private http: HttpClient,
    private checker : CheckConnectionService,
    private authService: AuthService
  ) {}

  fetchAll(q = "", rows = 10, start = 0, latitude = null, longitude = null, distance = null) {
    this.checker.handleConnection();
    let url = `${this.opendatasoftURL}&q=${q}&rows=${rows}&start=${start}`;
    if(latitude && longitude && distance){ url = `${url}&geofilter.distance=${latitude}%2C+${longitude}%2C+${distance}`; }
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) { throw new Error('User not found!'); }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => this.http.get<{ [key: string]: Place[] }>(url) ),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }
    ),
    tap(places => this._places.next(places) )
    );
  }

  getById(id: string) {
    this.checker.handleConnection();
    let url = `${this.opendatasoftURL}&refine.recordid=${id}`;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: Place[] }>(url);
      }),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }),
      tap(deliveries =>  this._places.next(deliveries) )
    );
  }

  mapper(d){
    return {
      recordid : d.recordid ? d.recordid : "",
      fields : {
        dep_name : d.fields.dep_name ? d.fields.dep_name : "",
        reg_name : d.fields.reg_name ? d.fields.reg_name : "",
        name : d.fields.name ? d.fields.name : "",
        opening_date : d.fields.opening_date ? d.fields.opening_date : "",
        closing_date : d.fields.closing_date ? d.fields.closing_date : "",
        geo_point_2d : d.fields.geo_point_2d ? d.fields.geo_point_2d : [],
      }
    }
  }
}
