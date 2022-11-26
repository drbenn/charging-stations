export class LoadStations {
  static readonly type = '[Data] load station data from data service';
  constructor(public stations: any) {}
}

export class ToggleMapBlur {
  static readonly type = '[Map] map blur toggle on/off';
  constructor(public mapBlurActive: boolean) {}
}

export class ToggleHeat {
  static readonly type = '[Map] heatmap toggle on/off';
  constructor(public heatActive: boolean) {}
}


export class SetFilterOptions {
  static readonly type = '[Filter Pane] all filter options to state';
  constructor(public options: string[][]) {}
}
