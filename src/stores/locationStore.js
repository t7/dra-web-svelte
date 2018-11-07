import { Store } from 'svelte/store.js';
import { API_IP_IMAGES, API_ZIP } from '../constants';
import { globalStore } from './';

class LocationStore extends Store {
  async fetchCurrentLocation() {
    try {
      const response = await fetch('http://ip-api.com/json');
      const json = await response.json();
      const { city, lat, lon, region, regionName, } = await json;
      return {
        city,
        lat,
        lon,
        region,
        regionName,
      };
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t find your location. Please try again.' });
      console.log('Get User\'s Location:', err);
    }
  }
  async getCityImage(lat, lon) {
    try {
      const response = await fetch(
        `${API_IP_IMAGES}/${lat},${lon}/?embed=location:nearest-urban-areas/
        location:nearest-urban-area/ua:images`,
      );
      const json = await response.json();
      return {
        cityImage:
          json._embedded['location:nearest-urban-areas'][0]._embedded[
            'location:nearest-urban-area'
          ]._embedded['ua:images'].photos[0].image.web,
      };
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t find a city image. Please try again.' });
      console.log('Get City Image:', err);
    }
  };

  async getCityByZip(zipCode) {
    try {
      const response = await fetch(`${API_ZIP}/${zipCode}`);
      const json = await response.json();
      if (json.places && json.places[0]) {
        const final = json.places[0];
        const { latitude, longitude, state } = final;
        return {
          city: final['place name'],
          lat: parseFloat(latitude),
          lon: parseFloat(longitude),
          region: final['state abbreviation'],
          regionName: state,
        };
      }
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t find that location. Please try another.' });
      console.log('Get Zipcode Error:', err);
    }
  };

}

export const locationStore = new LocationStore();
