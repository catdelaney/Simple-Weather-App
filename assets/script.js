const API_KEY = 'b951e6496f1c42f8010f0800df7b1592';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecastDetails = document.getElementById('forecast-details');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = '';
    }
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                addToSearchHistory(city);
                getForecastData(city);
            } else {
                alert('City Name Not Found.')
            }
        })
        .catch(error => console.error('Error fetching current weather:', error));
}

function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
        <div class="weather-details">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" class="weather-icon" alt="Weather icon">
            <div>
                <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            </div>
        </div>
    `;
}

function addToSearchHistory(city) {
    const button = document.createElement('button');
    button.textContent = city;
    button.classList.add('list-group-item', 'list-group-item-action');
    button.addEventListener('click', () => getWeather(city));
    searchHistory.appendChild(button);
    
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
     }
 }
 
 function loadSearchHistory() {
     const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
     history.forEach(city => addToSearchHistory(city));
 }
 
 document.addEventListener('DOMContentLoaded', loadSearchHistory);


function getForecastData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayForecast(data) {
    forecastDetails.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {  // 8 timestamps per day
        const forecast = data.list[i];
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item');
        forecastElement.innerHTML = `
            <div class="weather-details">
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" class="weather-icon" alt="Weather icon">
                <div>
                    <h5>${new Date(forecast.dt * 1000).toLocaleDateString()}</h5>
                    <p>Temperature: ${forecast.main.temp}°C</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                </div>
            </div>
        `;
        forecastDetails.appendChild(forecastElement);
    }
}