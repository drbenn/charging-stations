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
  @Select(AppState.filteredStations) filteredStations$:Observable<StationModel[]>;
  _map: L.Map;
  _heatmap: any;
  _stations:any;
  _mapActive:boolean;
  // @Select(AppState.stations) stations$: Observable<StationModel[]>;

  activeStations: StationModel[] = [];
  activeMapPointsArray: any[] =[];
  heatmapActive: boolean = false;
  mapClass: string = 'map-no-blur';
  coverClass: string = 'activeMap'



  constructor(private viewContainerRef: ViewContainerRef, private mapService: MapService, private store: Store) {}

  ngOnInit():any {
  // const stations$: Observable<any> = this.store.select((state) => state.appState.stations);
  // stations$.subscribe((_stations: any) => {
  //   this._stations = _stations;
  // })

  const mapActiveToggle$: Observable<boolean> = this.store.select((state) => state.appState.mapView);
  mapActiveToggle$.subscribe((mapViewToggle: boolean) => {
    this._mapActive = mapViewToggle;
    if (mapViewToggle) {
      this.mapClass = 'map-blur';
      this.coverClass = 'inactive-map';
      this.mapClass = 'map-no-blur';
      this.coverClass = 'active-map';
    }
    if (!mapViewToggle) {
      this.mapClass = 'map-blur';
      this.coverClass = 'inactive-map';
    }
  })


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
    zoomControl: false,
    // maxBounds:L.bounds,
    maxBoundsViscosity: 1.0,
    layers: [tileLayer],
    attributionControl: false,
    gestureHandling: true,

    };
    // init map
    let myMap = L.map(this.mapElement.nativeElement, mapOptions).setView([40,-93], 4.5);
    // new L.Control.Zoom({position: 'bottomleft'}).addTo(myMap);

    const southWest = L.latLng(0, -180);
    const northEast = L.latLng(73, -40);
    const bounds = L.latLngBounds(southWest, northEast);

    myMap.setMinZoom(3);
    myMap.setMaxBounds(bounds);
    myMap.on('drag', function() {
    myMap.panInsideBounds(bounds, { animate: false });
});
    this._map =myMap;
    }

    // addLeafletControls(map: L.Map) {
    //   const zoom = L.control.zoom({
    //   position: 'bottomleft'}).addTo(map);
    // }

    initSubscriptions() {
    let mapPoints:any;



    // const stations$: Observable<any> = this.store.select((state) => state.appState.stations);
    // stations$.subscribe((_stations: StationModel[]) => {

    // const filteredStations$: Observable<StationModel[]> = this.store.select((state) => state.appState.filteredStations);
    this.filteredStations$.subscribe((_stations: StationModel[]) => {
      console.log('filter in map hit');

    if (_stations && _stations.length > 0) {
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
    maxClusterRadius: 65,
    disableClusteringAtZoom: 10,
    polygonOptions: {
      fillColor:'#0f84a5',
      color:"#77df94"
    },
    iconCreateFunction: this.createClusterIcon()
    });


    if (_stations && _stations.length) {
      _stations.forEach((station) => {
      let clusterGroup: L.MarkerClusterGroup;
      clusterGroup = clusterStation.addLayer(this.createStationMarker(station));
      if (clusterGroup) {
      this.activeMapPointsArray.push(clusterGroup)
      }
      });
      mapPoints = L.layerGroup(this.activeMapPointsArray).addTo(this._map);
    }
    //If heatmap active and data change, re-render heatmap
    if (this._heatmap && this.heatmapActive) {
    this.clearHeatmap();
    const newHeatArray = this.spawnHeatArray();
    this.initHeatmap(newHeatArray);
    }
    })

    const heatmapToggle$: Observable<boolean> = this.store.select((state) => state.appState.heatMapOn);
    // heatmapToggle$.subscribe((_heatMapToggle: boolean) =>  this.heatmapActive = _heatMapToggle)
    // let heatmapActive$: Observable<Boolean> = this.store.select((state) => state.appState.mapPageHeatmapActive);
    heatmapToggle$.subscribe((heatmapToggle: boolean) => {

    this.heatmapActive = heatmapToggle;
    const heatArray: [][] = this.spawnHeatArray();

    // //draws heat on activate
    if(heatmapToggle) {
    this.initHeatmap(heatArray);
    }

    // // removes heatmap after being added to map
    if (this._heatmap && !heatmapToggle) {
    this.clearHeatmap();
    }
    })


    }



    private spawnHeatArray(): [][] {
    let heatArray: [][] = [];
    let maxAmp = 0;

    //finds highest amp to calc 3 val of heattuple, intensity, which affects gradient color sensitivity
    // change to reducer
    // this.activeStations.forEach(obj => obj.capacity > maxAmp? maxAmp = obj.capacity : maxAmp = maxAmp)
    // console.log(this.activeStations);
    if (this.activeStations && this.activeStations.length > 0) {
      const heatTuple = this.activeStations.forEach(obj => {
        let heatTuple;
      // let coords = [obj.lat, obj.lng];
      // let newCoords = this.mapService.coordinateFormatter(coords);
      // if (obj.capacity > maxAmp) {maxAmp = obj.capacity}
        heatTuple = [obj.lat, obj.lng, Math.random()]
        heatArray.push(heatTuple)
      })

    }
      return heatArray


      }


    private initHeatmap(data?: [][]) {

    const heat = (L as any).heatLayer(data, {
    radius: 70,
    maxZoom:12,
    gradient: { 0.0: '#6226ee', 0.5: '#5acbff', 0.8:'#ff5a86'},
    }).addTo(this._map);

    this._heatmap = heat;
    }

    clearHeatmap() {
    this._heatmap.setLatLngs([]);
    this._heatmap.redraw();
    }

    createStationMarker(station: StationModel) {
    let coords: string[] | number[] = [station.lat, station.lng];
    // coords = this.mapService.coordinateFormatter(coords);
      // console.log(coords);

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
    iconUrl: '../../assets/img/marker-2.png',
    iconSize:[15,24.25],
    shadowSize: [50,50],
    iconAnchor: [0,40],
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
    <div style="transform: translate(-8px,-5px); border: 1px solid transparent; width: 25px; text-align: center;">
    ${cluster.getChildCount()}
    </div>
    `;
    return L.divIcon({ html: template });
    };
    }



  }


