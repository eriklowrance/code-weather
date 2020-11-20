const searchButton = $("#search-btn");
//if array is empty will take after colon, before if else
let cityHistory = JSON.parse(localStorage.getItem("savedCity"))
  ? JSON.parse(localStorage.getItem("savedCity"))
  : [];
//function for saving searched cities to local storage
function setHistory() {
  localStorage.setItem("savedCity", JSON.stringify(cityHistory));
  $("#localCity").empty();
// for loop creating new li's with city name
  for (let i = 0; i < cityHistory.length; i++) {
    var li = $("<li>").attr("class", "list-group-item").text(cityHistory[i]);
    $("#localCity").append(li);
  }
  $(".list-group-item").on("click", function (){
    var cityName = $(this).text()
    buildQueryURL(cityName);
  })
}
//populating searched city history
setHistory();
//search button on click function
searchButton.on("click", function (e) {
  e.preventDefault();
  var cityName = $("#search").val().trim();
  //guard clause to protect from adding empty text to history
  if (cityName.length > 0 && cityHistory.indexOf(cityName)=== -1) {
    cityHistory.push(cityName);
  }

  setHistory();

  console.log(cityName);
  buildQueryURL(cityName);
 
});
//function for current forecast and api call
function buildQueryURL(cityName) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=dc9c6ebc0e85044023cc0d11835373cd";
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    //getting and converting current date
    let currentDate = moment(data.dt, "X").format("( l )");
    let searchCity = $("<span>")
      .attr("class", "citySearch")
      .html(
        data.name +
          currentDate +
          "<img src='http://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          ".png'>"
      );
    console.log(data.name);
        //getting and converting current temperature
    var tempF = (data.main.temp - 273.15) * 1.8 + 32;
    let temperature = $("<p>")
      .attr("class", "tempData")
      .text("Temperature (F): " + tempF.toFixed(2));
    console.log(tempF);
    //getting current humidity
    let humidity = $("<p>")
      .attr("class", "humidity")
      .text("Humidity: " + data.main.humidity);
      //getting current windspeed
    let windspeed = $("<p>")
      .attr("class", "windspeed")
      .text("Windspeed: " + data.wind.speed);
        //second api call for uv index
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&appid=dc9c6ebc0e85044023cc0d11835373cd",
      method: "GET",
    }).then(function (uv) {
      $("#results-container").empty();
      //getting curretn uv index
      console.log(uv);
      let uvIndex = $("<p>")
        .attr("class", "uvindex")
        .text("UV Index: " + uv.value);
      console.log(tempF);
      //appending results to results container
      $("#results-container").append(
        searchCity,
        temperature,
        humidity,
        windspeed,
        uvIndex
      );
      //3rd api call for 5 day forecast
      $.ajax({
        url:
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          data.coord.lat +
          "&lon=" +
          data.coord.lon +
          "&units=imperial&appid=dc9c6ebc0e85044023cc0d11835373cd",
        method: "GET",
      }).then(function (fiveDays) {
        for (let i = 1; i < 6; i++) {
          $("#day" + [i]).empty();
        }
        console.log(fiveDays);
        for (let i = 1; i < 6; i++) {
          let futureDate = moment(fiveDays.daily[i].dt, "X").format("( l )");
          $("#day" + [i]).append(
            $("<p>").attr("class", "pForecast").text(futureDate)
          );
          $("#day" + [i]).append(
            $("<p>")
              .attr("class", "pForecast")
              .html(
                "<img src='http://openweathermap.org/img/wn/" +
                  fiveDays.daily[i].weather[0].icon +
                  ".png'>"
              )
          );
          $("#day" + [i]).append(
            $("<p>")
              .attr("class", "pForecast")
              .text("Temp (F): " + fiveDays.daily[i].temp.day)
          );
          $("#day" + [i]).append(
            $("<p>")
              .attr("class", "pForecast")
              .text("Humidity: " + fiveDays.daily[i].humidity + "%")
          );
        }
      });
    });
  });
}