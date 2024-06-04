import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Plot } from '../plot.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  private map!: L.Map;
  private apiUrl = 'https://dev.chronicle.rip/api/v1/ms/plots-in-viewport?bounds=115.19192682579163,-8.635945622432802,115.19218364730479,-8.635783199701216';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.loadPlots();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-8.635945622432802, 115.19192682579163], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadPlots(): void {
    this.http.get(this.apiUrl).subscribe((data: any) => {
      data.forEach((plot : Plot) => {
        const marker = L.marker([plot.lat, plot.lng]).addTo(this.map);
        marker.bindPopup(`<b>${plot.name}</b><br>${plot.description}`);
        marker.on('mouseover', function () {
          marker.openPopup();
        });
      });
    });
  }

}
