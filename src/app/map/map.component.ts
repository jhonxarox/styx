import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Plot } from '../plot.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit{
  private map!: L.Map;
  private apiUrl = 'https://dev.chronicle.rip/api/v1/ms/plots-in-viewport?bounds=115.19192682579163,-8.635945622432802,115.19218364730479,-8.635783199701216';

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.getPlots(this.map);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 115.19192682579163,-8.635945622432802],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private getPlots(map: L.Map): void {
    this.http.get<Plot>(this.apiUrl).subscribe((res: Plot) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0][0][0];
        const lat = c.geometry.coordinates[0][0][1];
        const marker = L.marker([lat, lon]);

        const personsInfo = c.properties.persons.map(person =>
          `${person.first_name} ${person.last_name} (DOB: ${person.date_of_birth}, DOD: ${person.date_of_death})`
        ).join('<br>');

        marker.bindPopup(`
          <b>Plot ID:</b> ${c.properties.plot_id}<br>
          <b>Status:</b> ${c.properties.status}<br>
          <b>Section:</b> ${c.properties.section}<br>
          <b>Row:</b> ${c.properties.row}<br>
          <b>Plot No:</b> ${c.properties.plot_no}<br>
          <b>Cemetery Name:</b> ${c.properties.cemetery_name}<br>
          <b>Persons:</b><br>${personsInfo}
        `);

        marker.addTo(map);
      }
    });
  }

}
