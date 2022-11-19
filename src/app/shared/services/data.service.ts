import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadStations } from '../state/appState.actions';


@Injectable({
  providedIn: 'root',
  })

export class DataService {


  constructor(
    private httpClient: HttpClient,
    private store:Store
    ) {}


  getJsonData() {
    const jsonFile = '../../../assets/data/stationData.json';
    const jsonData = this.httpClient.get(jsonFile).subscribe((data)=> {
      console.log(data);
      this.store.dispatch(new LoadStations(data));
      return data
    })

    }







}
