import { Store } from 'svelte/store.js';
import { API_IP_IMAGES } from '../../constants';

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
    } catch (error) {
      return { error };
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
    } catch (error) {
      return { error };
    }
  };
}

export const locationStore = new LocationStore();
