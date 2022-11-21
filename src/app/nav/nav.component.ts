import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleHeat, ToggleMapBlur } from '../shared/state/appState.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  heatActive:boolean = true;
  mapBlur:boolean = false;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  mapBlurToggle() {
    this.mapBlur = !this.mapBlur;
    this.store.dispatch(new ToggleMapBlur(this.mapBlur));
  }

  heatToggle() {
    this.heatActive = !this.heatActive;
    this.store.dispatch(new ToggleHeat(this.heatActive));
  }
}
