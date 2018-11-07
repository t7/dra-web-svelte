import { Store } from 'svelte/store.js';
import { API_POINTS } from '../constants';
import { globalStore } from './';

export class WeatherStore extends Store {
  async getWeatherEndpoints(lat, lon) {
    try {
      const response = await fetch(`${API_POINTS}/${lat},${lon}`);
      const json = await response.json();

      const { forecast, forecastHourly } = json.properties;

      return {
        forecastUrl: forecast,
        forecastHourlyUrl: forecastHourly,
      };
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t get any weather endpoints. Please try again.' });
      console.log('Get Weather Endpoints Error:', err);
    }
  };

  async getForecastHourly(forecastHourlyUrl) {
    try {
      const response = await fetch(`${forecastHourlyUrl}`);
      const { properties } = await response.json();
      return {
        forecastHourly: [...properties.periods],
        currentWeather: properties.periods[0],
      };
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t get the hourly forecast. Please try again.' });
      console.log('Hourly Forecast Error:', err);
    }
  };

  async getForecastDaily(forecastUrl) {
    try {
      const response = await fetch(`${forecastUrl}`);
      const { properties } = await response.json();
      return {
        forecastDaily: properties.periods,
      };
    } catch (err) {
      globalStore.setToastrOpen({ message: 'Couldn\'t get the daily forecast. Please try again.' });
      console.log('Daily Forecast Error:', err);
    }
  };
}

export const weatherStore = new WeatherStore();