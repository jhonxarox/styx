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

  private createPopupContent(properties: any): string {
    const statusIcon = properties.status === 'Occupied' ? '<span style="color: red;">●</span> Occupied' : '<span style="color: green;">●</span> Vacant';

    const personsInfo = properties.status === 'Occupied' ? properties.persons.map((person: any) =>
      `<div class="person-info">
        <b>Name:</b> ${person.first_name} ${person.last_name}<br>
        <b>DOB:</b> ${person.date_of_birth}<br>
        <b>DOD:</b> ${person.date_of_death}<br>
        <b>Age:</b> ${person.age}
      </div>`
    ).join('<br>') : '';

    return `
      <b>Plot ID:</b> ${properties.plot_id}<br>
      <b>Status:</b> ${statusIcon}<br>
      <b>Section:</b> ${properties.section}<br>
      <b>Row:</b> ${properties.row}<br>
      <b>Plot No:</b> ${properties.plot_no}<br>
      <b>Cemetery Name:</b> ${properties.cemetery_name}<br>
      ${personsInfo ? `<b>Persons:</b><br>${personsInfo}` : ''}
    `;
  }

  async getPlots(map: L.Map): Promise<void> {
    try {
      const res: Plot = await firstValueFrom(this.http.get<Plot>(this.apiUrl));
      console.log('Received response:', res); // Log the received data

      for (const c of res.features) {
        const coordinates = c.geometry.coordinates[0].map((coord: number[]) => L.latLng(coord[1], coord[0]));
        const polygon = L.polygon(coordinates);

        const popupContent = this.createPopupContent(c.properties);

        polygon.bindPopup(popupContent);

        polygon.addTo(map);
        polygon.on('mouseover', (e)=> polygon.openPopup());
        polygon.on('mouseout', (e)=> polygon.closePopup());
      }
    } catch (err) {
      console.error('Error fetching plots:', err); // Log any error
    }
  }
}
