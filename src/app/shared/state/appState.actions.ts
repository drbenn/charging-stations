export class LoadStations {
  static readonly type = '[Data] load station data from data service';
  constructor(public stations: any) {}
}

export class ToggleHeat {
  static readonly type = '[Map] heatmap toggle on/off';
  constructor(public heatActive: boolean) {}
}
