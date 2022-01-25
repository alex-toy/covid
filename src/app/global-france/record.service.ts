import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { CheckConnectionService } from '../check-connection.service';
import { Record } from './record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private _records = new BehaviorSubject<Record[]>([]);
  private opendatasoftURL : string = environment.globalFranceURL;

  get records() {
    return this._records.asObservable();
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
      switchMap(token => this.http.get<{ [key: string]: Record[] }>(url) ),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }
    ),
    tap(places => this._records.next(places) )
    );
  }

  getById(id: string) {
    this.checker.handleConnection();
    let url = `${this.opendatasoftURL}&refine.recordid=${id}`;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: Record[] }>(url);
      }),
      map(resData => {
        const data = resData.records;
        const list = data.map(d => this.mapper(d) );
        return list;
      }),
      tap(records =>  this._records.next(records) )
    );
  }

  mapper(d){
    return {
      "recordid": d.recordid ? d.recordid : "",
      "fields": {
          "tot_recovered": d.fields.tot_recovered ? d.fields.tot_recovered : 0,
          "tot_positive": d.fields.tot_positive ? d.fields.tot_positive : 0,
          "tot_death_hosp": d.fields.tot_death_hosp ? d.fields.tot_death_hosp : 0,
          "tot_hosp": d.fields.tot_hosp ? d.fields.tot_hosp : 0,
          "count_new_icu": d.fields.count_new_icu ? d.fields.count_new_icu : 0,
          "tot_icu": d.fields.tot_icu ? d.fields.tot_icu : 0,
          "count_new_hosp": d.fields.count_new_hosp ? d.fields.count_new_hosp : 0,
          "date": d.fields.date ? d.fields.date : "",
          "tot_death_ephad": d.fields.tot_death_ephad ? d.fields.tot_death_ephad : 0,
      }
    }
  }
}
