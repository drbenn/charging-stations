export class LoadStations {
  static readonly type = '[Data] load station data from data service';
  constructor(public stations: any) {}
}

export class ToggleMapView {
  static readonly type = '[Map] turn map view on/off';
  constructor(public mapView: boolean) {}
}

export class ToggleHeat {
  static readonly type = '[Map] heatmap toggle on/off';
  constructor(public heatActive: boolean) {}
}


export class SetFilterOptions {
  static readonly type = '[Filter Pane] all filter options to state';
  constructor(public options: string[][]) {}
}
