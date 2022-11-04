const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const cityEl = document.getElementById('city');
const forecastEl = document.getElementById('forecast');
const currentTempEl = document.getElementById('current-temperature');
var cityformEl = document.getElementById("city-form")
var citiesListEl = document.getElementById("previous-Searches")

var searchHistory = []

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const API_KEY = 'd91f911bcf2c0f925fb6535547a5ddc9';
const api_key = '1d4a8ce213a4c48804861b2fc4271d70';

const weatherApiRootUrl = 'https://api.openweathermap.org';

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hours12 = hour >= 13 ? hour %12: hour;
  const minutes = time.getMinutes();
  const ampm = hour >=12 ? 'PM' : 'AM';

  timeEl.innerHTML = (hours12 < 10? '0' + hours12 : hours12) + ':' + (minutes < 10? '0' + minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

$(document).ready(function () {
  var storedHistory = JSON.parse(localStorage.getItem("Search History"))
  searchHistory = storedHistory?storedHistory:[]
  cityformEl.onsubmit = function(event){
    event.preventDefault();
    var city = event.target[0].value;
    console.log(city)
    searchHistory.push(city);
    localStorage.setItem("Search History", JSON.stringify(searchHistory));

    var ol = document.createElement('ol');
    for(i = 0; i < searchHistory.length; i++)
    {
        var li=document.createElement('li');
        li.innerHTML = searchHistory[i];
        ol.appendChild(li);
    }
    document.getElementById('previous-Searches').appendChild(ol);
}});

cityformEl.addEventListener("submit", (event) => {
  event.preventDefault();

  var cityInput = document.getElementById('citySelection').value;
  console.log(`City: ${cityInput}`);
  
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${api_key}`)
    .then(res => res.json()).then(data => {
      console.log(data);
      
      var latitude = data.city.coord.lat;
      var longitude = data.city.coord.lon;
      console.log(latitude, longitude);
          
      fetch(`${weatherApiRootUrl}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=${API_KEY}`)
        .then(res => res.json()).then(data => {
          console.log(data);
          displayWeatherData(data);
        })
    })
    .catch(error => console.log(error));

    while (citiesListEl.hasChildNodes()){
      citiesListEl.removeChild(citiesListEl.firstChild);
    }
 })

function displayWeatherData (data){
  let {temp, humidity, wind_speed} = data.current;
  console.log(temp, humidity, wind_speed);

  currentWeatherItemsEl.innerHTML = 
  `<div class="weater-item">
     <div>Current Temperature</div>
     <div>${temp}F</div>
    </div>
  <div class="weater-item">
    <div>Current Humidity</div>
    <div>${humidity}%</div>
  </div>
   <div class="weater-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
  </div>`;

  let fiveDayForecast = ''
  data.daily.forEach((day, idx) => {
    if(idx == 0){
      currentTempEl.innerHTML =`
      <div class="current-day" id="current-temperature">
      <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="weather-picture">
      <div class="temp">${day.temp.day}F</div>
      <div class="humidity">Humidity: ${day.humidity}%</div>
      <div class="wind-speed">Wind: ${day.wind_speed}Mph</div>
    </div>
      `
    }else if(idx >= 1 && idx <= 4){
      fiveDayForecast += `
        <div class="weather-item">
        <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="weather-picture">
        <div class="temp">${day.temp.day}F</div>
        <div class="humidity">Humidity: ${day.humidity}%</div>
        <div class="wind-speed">Wind: ${day.wind_speed}Mph</div>
        </div>`
    }
  })
  forecastEl.innerHTML = fiveDayForecast;
}
