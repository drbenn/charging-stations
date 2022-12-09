import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
    mapView: true,
    heatMapOn: true,
    filterOptions: {connectors:[], networks:[], costs:[]},
    selectedFilterOptions: ["J1772", "NEMA520","CHADEMO", "J1772COMBO", "NEMA515", "TESLA",  "NEMA1450","Non-Networked","SHELL_RECHARGE","AMPUP","ChargePoint Network","EVRANGE","POWERFLEX",
    "EVCS","Tesla Destination","Tesla","Blink Network","FCN","Charge","Free"],
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
    console.log(state);

    return state.stations.filter((station) => {
      // return station.network === "AMPUP"
      let acceptedStations: boolean =
      this.connectorSubFilter(station, state.selectedFilterOptions)

      return acceptedStations;


    })



    // return allStations;
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
    console.log(payload.options);

    let connectorOptions:string[] = payload.options[0]
    let networkOptions: string[] = payload.options[1]
    let costOptions: string[] = ["Charge", "Free"]
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

  static connectorSubFilter(station:StationModel, selectedFilters:string[]):boolean {
    console.log(station);
    console.log(selectedFilters);


      return  selectedFilters.some(selected => station.connectorTypes.includes(selected))
  }
  static networkSubFilter(station:StationModel, selectedFilters:string[]):boolean {
    return  selectedFilters.some(selected => station.network.includes(selected))
}
}
