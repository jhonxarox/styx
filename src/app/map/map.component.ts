import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PlotService } from '../plot.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit{
  private map!: L.Map;

  constructor(private plotService: PlotService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadPlots();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-8.635864411067009,115.19205523654821],
      zoom: 22,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 22,
      maxZoom: 25,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private async loadPlots(): Promise<void> {
    console.log('Fetching plots'); 
    await this.plotService.getPlots(this.map);
    console.log('Done Fetching'); 
  }
}
