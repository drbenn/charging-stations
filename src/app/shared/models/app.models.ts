export interface StationModel {
  name: string,
  lat: number,
  lng: number,
  address: string,
  city: string,
  state: string,
  zip: string,
  accessType:string,
  accessTime:string,
  fuelType: string,
  connectorTypes: string,
  owner: string,
  status: string,
  network: string,
  pricing: string,
}


export interface FilterListObject {
  connectors: FilterOptions[],
  networks: FilterOptions[],
  costs: FilterOptions[],
}

export interface FilterOptions {
  name: string;
  active: boolean;
}
