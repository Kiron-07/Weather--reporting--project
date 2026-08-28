import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface MainWeather {
  temp: number;
  humidity: number;
}

interface Wind {
  speed: number;
}

export interface Weather {
  weather: {
    main: string;
  }[];
  main: MainWeather;
  wind: Wind;
}

export interface Forecast {
  dt_txt: string;
  main: MainWeather;
  weather: {
    main: string;
  }[];
}

export interface ForecastResult {
  list: Forecast[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  private http = inject(HttpClient);

  private readonly baseURL =
    'https://api.openweathermap.org/data/2.5/weather?q=';

  private readonly forecastURL =
    'https://api.openweathermap.org/data/2.5/forecast?q=';

  private readonly appID =
    environment.appID;


  getWeather(
    city: string,
    metric: 'metric' | 'imperial' = 'metric'
  ): Observable<Weather> {

    return this.http.get<Weather>(
      `${this.baseURL}${encodeURIComponent(city)}&units=${metric}&appid=${this.appID}`
    );

  }


  getForecast(
    city: string,
    metric: 'metric' | 'imperial' = 'metric'
  ): Observable<Forecast[]> {

    return this.http
      .get<ForecastResult>(
        `${this.forecastURL}${encodeURIComponent(city)}&units=${metric}&appid=${this.appID}`
      )
      .pipe(
        map(weather => weather.list)
      );

  }

}