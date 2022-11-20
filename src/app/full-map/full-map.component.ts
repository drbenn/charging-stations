import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { StationModel } from '../shared/models/app.models';
import { MapService } from '../shared/services/map.service';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat/dist/leaflet-heat.js';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet.heat/dist/leaflet-heat.js';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../shared/state/appState.state';


@Component({
  selector: 'app-full-map',
  templateUrl: './full-map.component.html',
  styleUrls: ['./full-map.component.scss'],
  // allows editing of leaflet(tooltip) from scss
  encapsulation: ViewEncapsulation.None,
})

export class FullMapComponent implements OnInit {

  @ViewChild( 'map', {static: true}) mapElement: ElementRef;
  _map: L.Map;
  _heatmap: any;
  _stations:any;
  // @Select(AppState.stations) stations$: Observable<StationModel[]>;

  activeStations: StationModel[] = [];
  activeMapPointsArray: any[] =[];
  heatmapActive: boolean = false;



  constructor(private viewContainerRef: ViewContainerRef, private mapService: MapService, private store: Store) {}

  ngOnInit():any {
  // const stations$: Observable<any> = this.store.select((state) => state.appState.stations);
  // stations$.subscribe((_stations: any) => {
  //   this._stations = _stations;
  // })

  this.initMap();
  this.initSubscriptions();
  }


  initMap() {
    // L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    // tile providers: https://leaflet-extras.github.io/leaflet-providers/preview/
    //OpenStreetMap.HOT
    const openStHot = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    // Stadia.AlidadeSmoothDark:
    const stadiaDark = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
    // cartoDB.DarkMatter
    const cartoDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    // NASAGIBS.ViirsEarthAtNight2012
    const nasaNight = 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}'
    const tileLayer = L.tileLayer(cartoDark);

    const mapOptions = {
    zoomControl: true,
    layers: [tileLayer],
    attributionControl: false,
    gestureHandling: true,
    };
    // init map
    let myMap = L.map(this.mapElement.nativeElement, mapOptions).setView([40,-97],4.5);
    // this.addLeafletControls(myMap);

    this._map =myMap;
    }

    // addLeafletControls(map: L.Map) {
    //   const zoom = L.control.zoom({
    //   position: 'bottomleft'}).addTo(map);
    // }

    initSubscriptions() {

    let mapPoints:any;
    const stations$: Observable<any> = this.store.select((state) => state.appState.stations);
    stations$.subscribe((_stations: StationModel[]) => {

    if (_stations.length > 0) {
    console.log(_stations);
    }

    this.activeStations = _stations;

    // Clear layers
    if (this.activeMapPointsArray.length > 0) {
    mapPoints.clearLayers();
    }
    this.activeMapPointsArray = [];

    // Init cluster and cluster settings
    let clusterStation = L.markerClusterGroup({
    maxClusterRadius: 50,
    disableClusteringAtZoom: 12,
    // iconCreateFunction: this.createClusterIcon()
    });

    _stations.forEach((station) => {
    let clusterGroup: L.MarkerClusterGroup;
    clusterGroup = clusterStation.addLayer(this.createStationMarker(station));
    if (clusterGroup) {
    this.activeMapPointsArray.push(clusterGroup)
    }
    });
    mapPoints = L.layerGroup(this.activeMapPointsArray).addTo(this._map);

    //If heatmap active and data change, re-render heatmap
    // if (this._heatmap && this.heatmapActive) {
    // this.clearHeatmap();
    // const newHeatArray = this.spawnHeatArray();
    // this.initHeatmap(newHeatArray);
    // }
    // })

    // let heatmapActive$: Observable<Boolean> = this.store.select((state) => state.appState.mapPageHeatmapActive);
    // heatmapActive$.subscribe((heatmapActive: boolean) => {
    // this.heatmapActive = heatmapActive;
    // const heatArray: [][] = this.spawnHeatArray();

    // //draws heat on activate
    // if(heatmapActive) {
    // this.initHeatmap(heatArray);
    // }

    // // removes heatmap after being added to map
    // if (this._heatmap && !heatmapActive) {
    // this.clearHeatmap();
    // }
    // })


      })
    }


    // private spawnHeatArray(): [][] {
    // let heatArray: [][] = [];
    // let maxAmp = 0;

    // //finds highest amp to calc 3 val of heattuple, intensity, which affects gradient color sensitivity
    // // change to reducer
    // this.activeStations.forEach(obj => obj.capacity > maxAmp? maxAmp = obj.capacity : maxAmp = maxAmp)
    // const heatTuple = this.activeStations.forEach(obj => {
    // let heatTuple;
    // let coords = [obj.lat, obj.lng];
    // let newCoords = this.mapService.coordinateFormatter(coords);
    // if (obj.capacity > maxAmp) {maxAmp = obj.capacity}
    // heatTuple = [newCoords[0], newCoords[1], Number(obj.capacity) / maxAmp]
    // heatArray.push(heatTuple)
    // })
    // return heatArray
    // }

    // private initHeatmap(data?: [][]) {

    // const heat = (L as any).heatLayer(data, {
    // radius: 100,
    // gradient: { 0.0: 'blue', 0.5: 'lime', 0.9:'red'},
    // }).addTo(this._map);

    // this._heatmap = heat;
    // }

    // private clearHeatmap() {
    // this._heatmap.setLatLngs([]);
    // this._heatmap.redraw();
    // }

    createStationMarker(station: StationModel) {
    let coords: string[] | number[] = [station.lat, station.lng];
    // coords = this.mapService.coordinateFormatter(coords);
      console.log(coords);

    //basic marker
    let marker = L.circleMarker([coords[0], coords[1]], {
    color: '#B0DEA0',
    fillColor: 'blue',
    fillOpacity: 0.9,
    radius: 5,
    opacity: 0.5,
    weight: 10,
    })

    // Or use icon image
    // iconsize hieght is 1.617 ratio of width
    let imgIcon = L.icon({
    iconUrl: '../../assets/pin-point.png',
    iconSize:[15,24.25],
    shadowSize: [50,50],
    iconAnchor: [22,94],
    shadowAnchor: [4,62],
    popupAnchor: [-3, -76]
    })

    const popupOptions = {className: "customPopup"};
    const tooltipTemplate = this.mapService.createTooltip(station);

    // tooltip bound to basic marker
    // marker.bindPopup(tooltipTemplate, popupOptions);
    // return marker

    // tooltip bounds to icon img marker
    const iconMarker = L.marker([coords[0], coords[1]], {icon:imgIcon}).bindPopup(tooltipTemplate, popupOptions);
    return iconMarker;
    }

    private createClusterIcon() {
    return (cluster) => {
    // bc encapsulation.none cancahnge in component stylesheet w .leaflet-div-icon
    let template = `
    <b>
    ${cluster.getChildCount()}
    </b>
    `;
    return L.divIcon({ html: template });
    };
    }



  }


