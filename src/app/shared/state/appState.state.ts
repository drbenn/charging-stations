import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { DataService } from '../services/data.service';
import { LoadStations } from './appState.actions';



export interface AppStateModel {
  stations: any;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    stations: '',
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

}
