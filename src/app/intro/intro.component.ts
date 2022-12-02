import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  _mapActive:boolean;

  constructor(private store: Store) { }

  ngOnInit(): void {
    const mapActiveToggle$: Observable<boolean> = this.store.select((state) => state.appState.mapView);
    mapActiveToggle$.subscribe((mapViewToggle: boolean) => {
      console.log(mapViewToggle);
      if (mapViewToggle) {
        this._mapActive = true;
      }
      if (!mapViewToggle) {
        this._mapActive = false;
      }
    })
  }

}
