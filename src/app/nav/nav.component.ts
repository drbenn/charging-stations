import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleHeat } from '../shared/state/appState.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  heatActive:boolean = true;
  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  heatToggle() {
    this.heatActive = !this.heatActive;
    console.log('in nav');

    this.store.dispatch(new ToggleHeat(this.heatActive));
  }
}
