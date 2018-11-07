import { Store } from 'svelte/store.js';
import { locationStore, weatherStore } from './';
import { HERO_FALLBACK } from '../constants';

class GlobalStore extends Store {
  // Toastr
  setToastrOpen({ message }) {
    this.set({ isToastrOpen: true, message });
  }

  setToastrClose() {
    this.set({ isToastrOpen: false });
  }

  toggleDrawer() {
    const { isDrawerOpen } = this.get();
    this.set({ isDrawerOpen: !isDrawerOpen });
  }

  async getUserLocation() {
    await locationStore.fetchCurrentLocation()
      .then(currentLocation => this.set({ currentLocation }));
  }

  async getCityImage() {
    const { lat, lon } = this.get().currentLocation;
    await locationStore.getCityImage(lat, lon)
      .then(({ cityImage }) => {
        cityImage
          ? document.getElementById('hero').style.backgroundImage = `url(${cityImage})`
          : document.getElementById('hero').style.backgroundImage = `url(${HERO_FALLBACK})`;
      });
  }

  async getWeatherEndpoints() {
    const { lat, lon } = this.get().currentLocation;
    await weatherStore.getWeatherEndpoints(lat, lon)
      .then(weatherEndpoints => this.set({ weatherEndpoints }));
  }

  async getWeatherDaily() {
    const { forecastUrl } = this.get().weatherEndpoints;
    await weatherStore.getForecastDaily(forecastUrl)
      .then(({ forecastDaily }) => this.set({ forecastDaily }));
  }

  async getWeatherHourly() {
    const { forecastHourlyUrl } = this.get().weatherEndpoints;
    await weatherStore.getForecastHourly(forecastHourlyUrl)
      .then(({ currentWeather }) => this.set({ currentWeather }));
  }

  async getCityByZip(zipCode) {
    await locationStore.getCityByZip(zipCode)
      .then((currentLocation) => this.set({ currentLocation }));
  }

  async setNewCity(zipCode) {
    this.setToastrOpen({ message: 'Loading weather' });
    await this.getCityByZip(zipCode);
    await this.getWeather();
    await this.getCityImage();
    this.setToastrClose();
    this.toggleDrawer();
  }

  async getWeather() {
    this.setToastrOpen({ message: 'Loading weather' });
    await this.getWeatherEndpoints();
    await this.getWeatherHourly();
    await this.getWeatherDaily();
  }
}

export const globalStore = new GlobalStore({
  isDrawerOpen: false,
});