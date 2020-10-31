let formEl = $(".search-form");
let searchDivEl = $(".search-results");
let apiKey = "03cfdfb45efe945bd0f5f118d4004d6b";

let searchHistory = JSON.stringify(localStorage.getItem("WeatherDashboard")) || [];

let apiUrl;
let todayDate = new Date();
let cityCoord = {"lon": 0, "lat": 0};


let getCityCoordinates = function (city) {
    let apiUrlForCoord = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch (apiUrlForCoord)
        .then(response => response.json())
        .then(function(object) {
            cityCoord["lon"] = object.coord.lon;
            cityCoord["lat"] = object.coord.lat;
            console.log(city);
            getTodayWeather(cityCoord, city);
        })
}

let displayTodayCard = function (todayObject, cityName) {
    let todayCard = $("<div>").addClass("card today-card");

    $("<h4>").addClass("card-title")
        .text(cityName)
        .appendTo(todayCard);
    $("<h5>").addClass("card-title")
        .text([todayDate.getMonth() + 1] + "-" + todayDate.getDate() + "-" + todayDate.getFullYear())
        .appendTo(todayCard);
    $("<p>").addClass("today-temp card-text")
        .text("Temperature: " + todayObject.daily[0].temp.day + " °F")
        .appendTo(todayCard);
    $("<p>").addClass("today-humidity card-text")
        .text("Humidity: " + todayObject.daily[0].humidity + "%")
        .appendTo(todayCard);
    $("<p>").addClass("today-wind-speed card-text")
        .text("Wind Speed: " + todayObject.daily[0].wind_speed + " MPH")
        .appendTo(todayCard);
    let uviLevel = todayObject.daily[0].uvi;
    let uviSpan = ""
    if (uviLevel >= 0 && uviLevel < 3) {
        uviSpan = '<span class="bg-success">' + uviLevel + '</span>';
    } else if (uviLevel >= 3 && uviLevel < 7) {
        uviSpan = '<span class="bg-warning">' + uviLevel + '</span>';
    } else {
        uviSpan = '<span class="bg-danger">' + uviLevel + '</span>';
    }
    $("<p>").addClass("today-uvindex card-text")
        .html("UV Index: " + uviSpan)
        .appendTo(todayCard);

    todayCard.appendTo(searchDivEl);
}

let display5DayCard = function (fiveDayObject, cityName) {
    let fiveDayCard = $("<div>").addClass("five-day-display");

    for (let i = 0; i < 5; i++) {
        let todayCard = $("<div>").addClass("card today-card");

        $("<h4>").addClass("card-title")
            .text(cityName)
            .appendTo(todayCard);
        $("<h5>").addClass("card-title")
            .text([todayDate.getMonth() + 1] + "-" + todayDate.getDate() + "-" + todayDate.getFullYear())
            .appendTo(todayCard);
        $("<p>").addClass("today-temp card-text")
            .text("Temperature: " + todayObject.daily[0].temp.day + " °F")
            .appendTo(todayCard);
        $("<p>").addClass("today-humidity card-text")
            .text("Humidity: " + todayObject.daily[0].humidity + "%")
            .appendTo(todayCard);
        $("<p>").addClass("today-wind-speed card-text")
            .text("Wind Speed: " + todayObject.daily[0].wind_speed + " MPH")
            .appendTo(todayCard);
        let uviLevel = todayObject.daily[0].uvi;
        let uviSpan = ""
        if (uviLevel >= 0 && uviLevel < 3) {
            uviSpan = '<span class="bg-success">' + uviLevel + '</span>';
        } else if (uviLevel >= 3 && uviLevel < 7) {
            uviSpan = '<span class="bg-warning">' + uviLevel + '</span>';
        } else {
            uviSpan = '<span class="bg-danger">' + uviLevel + '</span>';
        }
        $("<p>").addClass("today-uvindex card-text")
            .html("UV Index: " + uviSpan)
            .appendTo(todayCard);

        todayCard.appendTo(searchDivEl);
    }

}

//NOT NEEDED!! FOR TESTING ONLY!!!
let testAPIData = function(apiUrl, city) {
    console.log("Today's forecast");
    apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    let todayData = fetch(apiUrl)
        .then(response => response.json())
        .then(x => console.log(x));
}

//create fetch function for today's forecast
let getTodayWeather = function(cityCoord, city) {

    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + cityCoord["lat"] + "&lon=" + cityCoord["lon"] + "&units=imperial&exclude=minutely&appid=" + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(function(obj) {
            displayTodayCard(obj, city);
            console.log(obj);
        });
}

//create fetch function for today's forecast
let getTodayForecast = function(city) {
    getCityCoordinates(city);

    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + cityCoord["lat"] + "&lon=" + cityCoord["lon"] + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(obj => console.log(obj));
    //YOU ARE HERE!!!
}

//create fetch function for five-day forecast
let getFiveDayForecast = function(apiUrl, city) {
    console.log("5-day forecast");
    apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    let fiveDayData = fetch(apiUrl).then(response => response.json())
    console.log(fiveDayData);
}

//put search history in local storage
let updateSearchHistory = function(history) {
    localStorage.setItem("WeatherDashboard", JSON.stringify(history));
}

//function for populating search results
let runSearch = function(event) {
    event.preventDefault();
    
    let cityName = $("#city-name").val();

    let todayForecast = getCityCoordinates(cityName);

    //let fiveDayForecast = getFiveDayForecast()
    //let testInfo = testAPIData(apiUrl, cityName);
    //let fiveDatForecast = getFiveDayForecast(apiUrl, cityName);

}

//event handler for submit on form
formEl.on("submit", runSearch);