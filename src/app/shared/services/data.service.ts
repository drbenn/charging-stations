import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadStations, SetFilterOptions } from '../state/appState.actions';


@Injectable({
  providedIn: 'root',
  })

export class DataService {
  
  constructor(
    private httpClient: HttpClient,
    private store:Store
    ) {}


  public initData() {
    const jsonFile = '../../../assets/data/stationData.json';
    const jsonData = this.httpClient.get(jsonFile).subscribe((data)=> {
      this.store.dispatch(new LoadStations(data));
      this.getFilterOptions(data);
    })
  }


  private getFilterOptions(data) {
    let connects = []
    data.forEach((obj) => {
      if(obj.connectorTypes) {
        connects.push(obj.connectorTypes)
      }
    })
    connects = connects.flat()
    let connectSet = new Set(connects)
    let connectUniqueArray = Array.from(connectSet);
    

    let networks = []
    data.forEach((obj) => networks.push(obj.network))
    let networkSet = new Set(networks)
    let networkUniqueArray = Array.from(networkSet);


    let pricing = []
    data.forEach((obj) => pricing.push(obj.pricing))
    let pricingSet = new Set(pricing)
    let pricingUniqueArray = Array.from(pricingSet);


    this.store.dispatch(new SetFilterOptions([ connectUniqueArray, networkUniqueArray, pricingUniqueArray ]));
  }
}
