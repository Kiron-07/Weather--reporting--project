import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { FbService } from '../../services/fb/fb.service';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from 'ngxui-auto-complete';
import { NgClass } from '@angular/common';
import { WeatherCardComponent } from '../../ui/weather-card/weather-card.component';
import { Subscription } from 'rxjs';

interface City {
  name: string;
  added: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NguiAutoCompleteModule,
    WeatherCardComponent,
    NgClass
  ],
})
export class AddComponent implements OnInit, OnDestroy {

  weather = inject(WeatherService);
  fb = inject(FbService);

  temp?: number;
  city = 'Rome';

  state?: string;

  selectedCity = '';

  cardCity?: string;

  showNote = false;

  followedCM = false;

  sub1!: Subscription;


  // ==========================================
  // CAPITAL CITY LIST
  // ==========================================

  capitals: string[] = [
    'Abu Dhabi',
    'Abuja',
    'Accra',
    'Addis Ababa',
    'Algiers',
    'Amman',
    'Amsterdam',
    'Andorra la Vella',
    'Ankara',
    'Antananarivo',
    'Apia',
    'Ashgabat',
    'Asmara',
    'Astana',
    'Asuncion',
    'Athens',
    'Baghdad',
    'Baku',
    'Bamako',
    'Bandar Seri Begawan',
    'Bangkok',
    'Bangui',
    'Banjul',
    'Basseterre',
    'Beijing',
    'Beirut',
    'Belgrade',
    'Belmopan',
    'Berlin',
    'Bern',
    'Bishkek',
    'Bissau',
    'Bogota',
    'Brasilia',
    'Bratislava',
    'Brazzaville',
    'Bridgetown',
    'Brussels',
    'Bucharest',
    'Budapest',
    'Buenos Aires',
    'Cairo',
    'Canberra',
    'Caracas',
    'Castries',
    'Chisinau',
    'Colombo',
    'Conakry',
    'Copenhagen',
    'Dakar',
    'Damascus',
    'Dhaka',
    'Dili',
    'Djibouti',
    'Dodoma',
    'Doha',
    'Dublin',
    'Dushanbe',
    'East Jerusalem',
    'Freetown',
    'Funafuti',
    'Gaborone',
    'Georgetown',
    'Gitega',
    'Guatemala City',
    'Hanoi',
    'Harare',
    'Havana',
    'Helsinki',
    'Honiara',
    'Islamabad',
    'Jakarta',
    'Jerusalem',
    'Juba',
    'Kabul',
    'Kampala',
    'Kathmandu',
    'Khartoum',
    'Kigali',
    'Kingston',
    'Kingstown',
    'Kinshasa',
    'Kuala Lumpur',
    'Kuwait City',
    'Kyiv',
    'Libreville',
    'Lilongwe',
    'Lima',
    'Lisbon',
    'Ljubljana',
    'Lome',
    'London',
    'Luanda',
    'Lusaka',
    'Luxembourg',
    'Madrid',
    'Majuro',
    'Malabo',
    'Male',
    'Managua',
    'Manama',
    'Manila',
    'Maputo',
    'Maseru',
    'Mbabane',
    'Mexico City',
    'Minsk',
    'Mogadishu',
    'Monaco',
    'Monrovia',
    'Montevideo',
    'Moroni',
    'Moscow',
    'Muscat',
    'Nairobi',
    'Nassau',
    'Naypyidaw',
    'New Delhi',
    'Ngerulmud',
    'Niamey',
    'Nicosia',
    'Nouakchott',
    'Nuku’alofa',
    'Oslo',
    'Ottawa',
    'Ouagadougou',
    'Palikir',
    'Panama City',
    'Paramaribo',
    'Paris',
    'Phnom Penh',
    'Podgorica',
    'Port Louis',
    'Port Moresby',
    'Port of Spain',
    'Port Vila',
    'Port-au-Prince',
    'Porto-Novo',
    'Prague',
    'Praia',
    'Pretoria',
    'Pyongyang',
    'Quito',
    'Rabat',
    'Reykjavik',
    'Riga',
    'Riyadh',
    'Rome',
    'Roseau',
    'Saint George’s',
    'Saint John’s',
    'Saint-Denis',
    'Saint-Pierre',
    'Sana’a',
    'San Jose',
    'San Marino',
    'San Salvador',
    'Santiago',
    'Santo Domingo',
    'Sao Tome',
    'Sarajevo',
    'Seoul',
    'Singapore',
    'Skopje',
    'Sofia',
    'Sri Jayawardenepura Kotte',
    'Stockholm',
    'Sucre',
    'Suva',
    'Taipei',
    'Tallinn',
    'Tarawa',
    'Tashkent',
    'Tbilisi',
    'Tegucigalpa',
    'Tehran',
    'Thimphu',
    'Tirana',
    'Tokyo',
    'Tripoli',
    'Tunis',
    'Ulaanbaatar',
    'Vaduz',
    'Valletta',
    'Vatican City',
    'Victoria',
    'Vienna',
    'Vientiane',
    'Vilnius',
    'Warsaw',
    'Washington',
    'Wellington',
    'Windhoek',
    'Yamoussoukro',
    'Yaounde',
    'Yaren',
    'Yerevan',
    'Zagreb'
  ];


  ngOnInit() {

    // ==========================================
    // LOAD ROME WEATHER
    // ==========================================

    this.weather.getWeather(this.city).subscribe({
      next: payload => {

        this.state = payload.weather[0]?.main;

        this.temp = Math.ceil(
          Number(payload.main.temp)
        );

      },

      error: error => {
        console.error(
          'Weather error:',
          error
        );
      }
    });


    // ==========================================
    // SORT CAPITAL CITIES
    // ==========================================

    this.capitals.sort();


    console.log(
      'Capital cities loaded:',
      this.capitals.length
    );


    // ==========================================
    // GET FOLLOWED CITIES FROM FIREBASE
    // ==========================================

    this.sub1 = this.fb.getCities().subscribe({

      next: (cities: City[]) => {

        cities.forEach(city => {

          if (
            city.name.toLowerCase() ===
            'rome'
          ) {

            this.followedCM = true;

          }

        });

      },

      error: error => {

        console.error(
          'Firebase cities error:',
          error
        );

      }

    });

  }


  // ==========================================
  // SELECT CITY
  // ==========================================

  selectCity(city: string) {

    const enteredCity =
      city.trim();

    console.log(
      'Searching city:',
      enteredCity
    );


    if (!enteredCity) {

      this.cardCity = undefined;

      this.showNote = false;

      return;

    }


    // Find city ignoring uppercase/lowercase

    const matchedCity =
      this.capitals.find(
        capital =>
          capital.toLowerCase() ===
          enteredCity.toLowerCase()
      );


    if (matchedCity) {

      console.log(
        'City found:',
        matchedCity
      );

      this.cardCity =
        matchedCity;

      this.selectedCity =
        matchedCity;

      this.showNote = false;

    } else {

      console.log(
        'City NOT found:',
        enteredCity
      );

      this.cardCity = undefined;

      this.showNote = true;

    }

  }


  // ==========================================
  // CITY OF THE MONTH
  // ==========================================

  addCityOfTheMonth() {

    this.fb
      .addCity('Rome')
      .subscribe({

        next: () => {

          this.followedCM =
            true;

        },

        error: error => {

          console.error(
            'Unable to follow Rome:',
            error
          );

        }

      });

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy() {

    if (this.sub1) {

      this.sub1.unsubscribe();

    }

  }

}