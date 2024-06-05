import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Plot } from './plot.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  private apiUrl = 'https://dev.chronicle.rip/api/v1/ms/plots-in-viewport?bounds=115.19192682579163,-8.635945622432802,115.19218364730479,-8.635783199701216';

  constructor(private http: HttpClient) { }

  async getPlots(map: L.Map): Promise<void> {
    try {
      const res: Plot = await firstValueFrom(this.http.get<Plot>(this.apiUrl));
      console.log('Received response:', res); // Log the received data

      for (const c of res.features) {
        const coordinates = c.geometry.coordinates[0].map((coord: number[]) => L.latLng(coord[1], coord[0]));
        const polygon = L.polygon(coordinates);

        const personsInfo = c.properties.persons.map(person =>
          `${person.first_name} ${person.last_name} (DOB: ${person.date_of_birth}, DOD: ${person.date_of_death})`
        ).join('<br>');

        polygon.bindPopup(`
          <b>Plot ID:</b> ${c.properties.plot_id}<br>
          <b>Status:</b> ${c.properties.status}<br>
          <b>Section:</b> ${c.properties.section}<br>
          <b>Row:</b> ${c.properties.row}<br>
          <b>Plot No:</b> ${c.properties.plot_no}<br>
          <b>Cemetery Name:</b> ${c.properties.cemetery_name}<br>
          <b>Persons:</b><br>${personsInfo}
        `);

        polygon.addTo(map);
      }
    } catch (err) {
      console.error('Error fetching plots:', err); // Log any error
    }
  }
}
