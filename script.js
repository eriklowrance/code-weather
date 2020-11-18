const searchButton = $("#search-btn");
searchButton.on("click", function (e) {
  e.preventDefault();
  var cityName = $("#search").val().trim();
  console.log(cityName);
  buildQueryURL();
  function buildQueryURL() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=dc9c6ebc0e85044023cc0d11835373cd";
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (data) {
 
        let currentDate = moment(data.dt, "X").format("( l )")
        let searchCity = $("<span>")
      .attr("class", "citySearch")
        .html(data.name + currentDate +  "<img src='http://openweathermap.org/img/wn/"+data.weather[0].icon+".png'>");
      console.log(data.name);

      var tempF = (data.main.temp - 273.15) * 1.8 + 32;
      let temperature = $("<p>")
        .attr("class", "tempData")
        .text("Temperature (F): " + tempF.toFixed(2));
        console.log(tempF)
      let humidity = $("<p>")
        .attr("class", "humidity")
        .text("Humidity: " + data.main.humidity);
      let windspeed = $("<p>")
        .attr("class", "windspeed")
        .text("Windspeed: " + data.wind.speed);
        console.log(tempF)

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=dc9c6ebc0e85044023cc0d11835373cd",
            method: "GET"
        }).then(function(uv){

                 console.log(uv)
            let uvIndex = $("<p>")
            .attr("class", "uvindex")
            .text("UV Index: " + uv.value);
            console.log(tempF)
    
    
            $("#results-container").append(searchCity, temperature, humidity, windspeed, uvIndex)
        })

          
    
    });

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=dc9c6ebc0e85044023cc0d11835373cd",
        method: "GET"
    }).then(function (fiveDays) {
        console.log(fiveDays)
        for (let i = 0; i < fiveDays.list.length; i++) {
            if (fiveDays.list[i].dt_txt.includes("00:00:00")){
                 console.log(fiveDays.list[i]) 
            }
        }
    })
  }
});
