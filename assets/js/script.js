const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const cityEl = document.getElementById('city');
const forecastEl = document.getElementById('forecast');
const currentTempEl = document.getElementById('current-temperature');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const API_KEY = '1d4a8ce213a4c48804861b2fc4271d70';

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

retrieveApiData()
function retrieveApiData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude} = success.coords;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`)
    .then(res => res.json()).then(data => {
      console.log(data);
      displayWeatherData(data);
    })
  })
}

function displayWeatherData (data){
  let {temp, humidity} = data.list[0].main;
  let {speed} = data.list[0].wind;

  currentWeatherItemsEl.innerHTML = 
  `<div class="weater-item">
     <div>Temperature</div>
     <div>${temp}F</div>
    </div>
  <div class="weater-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
  </div>
   <div class="weater-item">
    <div>Wind Speed</div>
    <div>${speed}</div>
  </div>`;
}
