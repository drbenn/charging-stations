import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterListObject } from 'src/app/shared/models/app.models';
import { UpdateSelectedFilterOptions } from 'src/app/shared/state/appState.actions';

@Component({
  selector: 'app-filter-pane',
  templateUrl: './filter-pane.component.html',
  styleUrls: ['./filter-pane.component.scss'],
})
export class FilterPaneComponent implements OnInit {
  _mapView:boolean;
  connectorOptions: string[] = [];
  networkOptions: string[] = [];
  costOptions: string[] = [];
  selectedOptions: string[] = [];

  burgerClasses= ['line-1', 'line-2', 'line-3'];
  burgerContainer:string = 'close-filter-burger';
  filterPaneClass:string = 'filter-pane-open';
  filterPaneOverflow: string = 'filter-pane-overflow-conatiner-open';

  constructor(private store: Store) {}

  ngOnInit(): void {
    let filterOptions$: Observable<FilterListObject> = this.store.select(
      (state) => state.appState.filterOptions);

    filterOptions$.subscribe((_filterOptions:FilterListObject) => {
      if (_filterOptions && this.connectorOptions.length === 0) {
        console.log(_filterOptions);

        // Set filter options available for UI
        this.connectorOptions = _filterOptions.connectors;
        this.networkOptions = _filterOptions.networks;
        this.costOptions = _filterOptions.costs;

        // Set all filter options as active
        _filterOptions.connectors.forEach((option) => this.selectedOptions.push(option));
        _filterOptions.networks.forEach((option) => this.selectedOptions.push(option));
        _filterOptions.costs.forEach((option) => this.selectedOptions.push(option));
      }
    })

    let mapView$: Observable<boolean> = this.store.select(
      (state) => state.appState.mapView);
    mapView$.subscribe((mapView:boolean) => {
      this._mapView = mapView;
    })

  }


  onFilterButtonClick(option) {
    if (this.selectedOptions.includes(option)) {
      const newOptions = this.selectedOptions.filter(item => item !== option)
      this.selectedOptions = newOptions;
    } else {
      this.selectedOptions.push(option)
    }
    this.store.dispatch(new UpdateSelectedFilterOptions(this.selectedOptions))
  }


  setBurgerClass(event:any) {
    const nodeList = Array(event.target.childNodes)[0];
    this.burgerContainer === "close-filter-burger" ? this.burgerContainer = "open-filter-burger" : this.burgerContainer = "close-filter-burger"
    this.filterPaneOverflow === "filter-pane-overflow-conatiner-closed" ?  this.filterPaneOverflow = "filter-pane-overflow-conatiner-open" :  this.filterPaneOverflow = "filter-pane-overflow-conatiner-closed"

    nodeList.forEach((nodeItem:any) => {
      const clss:string = nodeItem.className;
      const lastChar: string | number = clss[clss.length-1];
      let burgerIndex:number = Number(clss[5]) - 1;

      if (lastChar !== 'x') {
        this.burgerClasses[burgerIndex] = this.burgerClasses[burgerIndex] + "-x";
      }
      else {
        this.burgerClasses[burgerIndex] = this.burgerClasses[burgerIndex].substring(0,6);
      }
    })
  }
}
