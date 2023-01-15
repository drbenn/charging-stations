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
    if (state.selectedFilterOptions.length === 20) {
      return state.stations;
    }
    else {
      const filteredStations: StationModel[] = state.stations.filter((station) => {
        let activeFilters:string[] = state.selectedFilterOptions;
        let connectors: string[] = station.connectorTypes;
        let network: string = station.network;
        let price: string = '';
        station.pricing ? price = station.pricing.toLowerCase() : price = 'n/a';
        let connectorFilter = this.connectorSubFilter(connectors, activeFilters);
        let networkFilter = this.networkSubFilter(network,activeFilters);
        let priceFilter = this.priceSubFilter(price, activeFilters);
        return connectorFilter && networkFilter && priceFilter;
      })
      return filteredStations;
    }
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


  static networkSubFilter(network:string, activeFilters:string[]):boolean {
    return activeFilters.some(sFilter => network.includes(sFilter))
  }


  static priceSubFilter( price: string, activeFilters: string[]) {
    let isFree: boolean = price.includes('free');
    let isFreeSelected: boolean = activeFilters.includes('Free');
    let isPaySelected: boolean = activeFilters.includes('Pay');
    let shouldInclude: boolean;

    if (isFreeSelected && isFree || isPaySelected && !isFree) {
      shouldInclude = true;
    }
    if (!isFreeSelected && !isPaySelected) {
      shouldInclude = false;
    }
    return shouldInclude;
  }


  static connectorSubFilter( connectors: string[], activeFilters: string[]) {
    let inView: boolean;
    if (!connectors) {
      return false;
    }
    connectors.forEach(connector => {
      if (activeFilters?.includes(connector)) {
        inView = true;
      }
    })
    return inView;
  }
}
