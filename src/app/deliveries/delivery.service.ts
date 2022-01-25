import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { CheckConnectionService } from '../check-connection.service';
import { Delivery } from './delivery.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private _deliveries = new BehaviorSubject<Delivery[]>([]);
  private opendatasoftURL : string = environment.deliveryURL;

  get deliveries() {
    return this._deliveries.asObservable();
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
      switchMap(token => this.http.get<{ [key: string]: Delivery[] }>(url) ),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }
    ),
    tap(places => this._deliveries.next(places) )
    );
  }

  getById(id: string) {
    this.checker.handleConnection();
    let url = `${this.opendatasoftURL}&refine.recordid=${id}`;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: Delivery[] }>(url);
      }),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }),
      tap(deliveries =>  this._deliveries.next(deliveries) )
    );
  }

  mapper(data){
    return {
      recordid : data.recordid ? data.recordid : "",
      fields : {
          etat : data.fields.etat ? data.fields.etat : "",
          reg_name : data.fields.reg_name ? data.fields.reg_name : "",
          vaccine_type : data.fields.vaccine_type ? data.fields.vaccine_type : "",
          received_dose_total : data.fields.received_dose_total ? data.fields.received_dose_total : 0,
          received_ucd_total : data.fields.received_ucd_total ? data.fields.received_ucd_total : 0,
      }
    }
  }
}
