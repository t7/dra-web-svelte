import { Store } from 'svelte/store.js';
import { API_POINTS } from '../constants';

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
    } catch (error) {
      return { error };
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
    } catch (error) {
      return { error };
    }
  };

  async getForecastDaily(forecastUrl) {
    try {
      const response = await fetch(`${forecastUrl}`);
      const { properties } = await response.json();
      return {
        forecastDaily: properties.periods,
      };
    } catch (error) {
      return { error };
    }
  };
}

export const weatherStore = new WeatherStore();