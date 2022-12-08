import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterListObject, FilterOptions } from '../models/app.models';
import { DataService } from '../services/data.service';
import { LoadStations, SetFilterOptions, ToggleHeat, ToggleMapView, UpdateSelectedFilterOptions } from './appState.actions';



export interface AppStateModel {
  stations: any;
  filteredStations: any;
  mapView: boolean;
  heatMapOn: boolean;
  filterOptions: FilterListObject,
  selectedFilterOptions:string[],
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    stations: '',
    filteredStations: '',
    mapView: true,
    heatMapOn: true,
    filterOptions: {connectors:[], networks:[], costs:[]},
    selectedFilterOptions: [],
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
      const allStations = state.stations;
      const selectedFilters = state.filterOptions

      let filtereStations = allStations.filter((station) => {

      })


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

    let connectorOptions:FilterOptions[] = payload.options[0].map(option => {
      return {name: option,active: true,}})
    let networkOptions: FilterOptions[] = payload.options[1].map(option => {
      return {name: option,active: true,}})
    let costOptions:FilterOptions[] = [{name:"Charge", active: true},{name:"Free", active: true}]
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
}
