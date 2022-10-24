var apiKey = "1d4a8ce213a4c48804861b2fc4271d70"
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={1d4a8ce213a4c48804861b2fc4271d70}"

 fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
