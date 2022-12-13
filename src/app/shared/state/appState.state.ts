import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { FilterListObject, StationModel } from '../models/app.models';
import { DataService } from '../services/data.service';
import { LoadStations, SetFilterOptions, ToggleHeat, ToggleMapView, UpdateSelectedFilterOptions } from './appState.actions';



export interface AppStateModel {
  stations: any;
  // filteredStations: any;
  mapView: boolean;
  heatMapOn: boolean;
  filterOptions: FilterListObject,
  selectedFilterOptions:string[],
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    stations: '',
    // filteredStations: '',
    mapView: false,
    heatMapOn: true,
    filterOptions: {connectors:[], networks:[], costs:[]},
    selectedFilterOptions: ["J1772", "NEMA520","CHADEMO", "J1772COMBO", "NEMA515", "TESLA",  "NEMA1450","Non-Networked","SHELL_RECHARGE","AMPUP","ChargePoint","EVRANGE","POWERFLEX",
    "EVCS","Tesla Destination","Tesla","Blink","FCN","Pay","Free"],
  },
})
@Injectable()
export class AppState {

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private store: Store
  ) {}


  @Selector()
  static filteredStations(state:AppStateModel) {
    // console.log(state.selectedFilterOptions);
    if (state.selectedFilterOptions.length === 20) {
      return state.stations;
    }
// some determines if at least 1 item in an array meets a condition
// so station.connectorTypes meets condition of being included in selectedStations array
    // if (state.selectedFilterOptions.length < 20) {
    //   let newStations = state.stations.filter((station) => {
    //     // return station.network === "AMPUP"
    //       // if (station.connectorTypes.includes('TESLA')) {
    //       //   return true
    //       // }
    //       console.log(station.connectorTypes);

    //       return station.connectorTypes === "TESLA"
    //   })
    //   console.log('newStations State Selector Return');
    //   console.log(newStations);
    //   return newStations;

    // }
    else {
      console.log("else");
      console.log(state.selectedFilterOptions);

      const filteredStations: StationModel[] = state.stations.filter((station) => {
        // let free = station.pricing.search("Free") ? 'Free' : 'Pay';
        // console.log('free?');
        // console.log(free);

        // let stuff = state.selectedFilterOptions.some(sOption => station.network.includes(sOption))
        // let heck = state.selectedFilterOptions.some(sOption => station.connectorTypes.forEach(connector => connector.includes(sOption)))

        // let connectorFilter = this.connectorSubFilter(station, state.selectedFilterOptions);
        // return connectorFilter;}
        // NETWORK FILTER - GOOD!
        let networkFilter = this.networkSubFilter(station,state.selectedFilterOptions);
       return networkFilter}
        ///////////////////////

        // let twat = this.costSubFilter(station,state.selectedFilterOptions);
        // return twat}
        )


      console.log(filteredStations);

      return filteredStations;
    }




    // return state.stations;
  }



  @Action(LoadStations)
  loadStations(
    ctx: StateContext<AppStateModel>,
    payload: { stations: any }
  ) {
    ctx.patchState({ stations: payload.stations });
  }

  @Action(ToggleMapView)
  toggleMapView(
    ctx: StateContext<AppStateModel>,
    payload: { mapView: boolean }
  ) {
    ctx.patchState({ mapView: payload.mapView });
  }

  @Action(ToggleHeat)
  toggleHeat(
    ctx: StateContext<AppStateModel>,
    payload: { heatActive: boolean }
  ) {
   let mapView = ctx.getState().mapView;
    if (mapView) {
      ctx.patchState({ heatMapOn: payload.heatActive });
    }
  }

  @Action(SetFilterOptions)
  setFilterOptions(
    ctx: StateContext<AppStateModel>,
    payload: { options: string[][] }
  ) {
    let connectorOptions:string[] = payload.options[0]
    let networkOptions: string[] = payload.options[1]
    let costOptions: string[] = ["Pay", "Free"]
    let optionsObject: FilterListObject = {
      connectors: connectorOptions,
      networks: networkOptions,
      costs: costOptions
    }
    ctx.patchState({ filterOptions: optionsObject });
  }

  @Action(UpdateSelectedFilterOptions)
  updateSelectedFilterOptions(
    ctx: StateContext<AppStateModel>,
    payload: { selectedOptions: string[] }
  ) {
    ctx.patchState({ selectedFilterOptions: payload.selectedOptions });
  }

  // static connectorSubFilter(station:StationModel, selectedFilters:string[]):boolean {
  //   // console.log(station);
  //   // console.log(selectedFilters);
  //   if (station.connectorTypes === "NEMA1450") {
  //     console.log('in subfilter');

  //     console.log(station);
  //     console.log(selectedFilters);
  //   }

  //   let stationConnector = station.connectorTypes
  //   return selectedFilters.includes(stationConnector);


      // return  selectedFilters.some(selected => station.connectorTypes.includes(selected))
//   }


  static costSubFilter(station:StationModel, selectedFilters:string[]) {
    // return  selectedFilters.some(selected => station.network.includes(selected))
    let cost = station.pricing.search("Free") ? 'Free' : 'Pay';

    const both = selectedFilters.includes("Free") && selectedFilters.includes("Pay");
    const freeOnly = selectedFilters.includes("Free") && !selectedFilters.includes("Pay");
    const payOnly = !selectedFilters.includes("Free") && selectedFilters.includes("Pay");
    const neither = !selectedFilters.includes("Free") && !selectedFilters.includes("Pay");

    // return selectedFilters.some(sOption => station)
    if (neither) {
      return !station
    } else if (payOnly && cost === 'Pay') {
      return station
    } else if (freeOnly && cost === 'Free') {
      return station
    } else {
      return !station
    }
  }


  static connectorSubFilter(station:StationModel, selectedFilters:string[]):boolean {
    let connectors: string[] = station.connectorTypes;
    // console.log(connectors);
    let shazam = connectors.filter(connector => selectedFilters.includes(connector));
    console.log(shazam[0]);

    if (shazam !== undefined)  {
      return true
     } else {

     return false}
    // console.log(shazam);

    // return true
    // return connectors.forEach((connector) => selectedFilters.some(sOption => connector.includes(sOption)));
    // return selectedFilters.some(sOption => connectors.forEach(connector => connector.includes(sOption)));
  }

  static networkSubFilter(station:StationModel, selectedFilters:string[]):boolean {
    // return  selectedFilters.some(selected => station.network.includes(selected))


    return selectedFilters.some(sOption => station.network.includes(sOption))
  }
}
