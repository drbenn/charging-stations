import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { LoadStations, SetFilterOptions, ToggleHeat, ToggleMapView } from './appState.actions';



export interface AppStateModel {
  stations: any;
  mapView: boolean;
  heatMapOn: boolean;
  dropDownOptions: string[][],
  stationPriceOptions: string[],
  networkOptions: string[],
  connectorOptions: string[],
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    stations: '',
    mapView: false,
    heatMapOn: true,
    dropDownOptions: [],
    stationPriceOptions: [],
    networkOptions: [],
    connectorOptions: [],
  },
})
@Injectable()
export class AppState {

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private store: Store
  ) {}

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
    ctx.patchState({
      dropDownOptions: payload.options,
      stationPriceOptions: payload.options[0],
      networkOptions: payload.options[1],
      connectorOptions: payload.options[2],
      });
  }
}
