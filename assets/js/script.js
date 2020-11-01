let formEl = $(".search-form");
let searchDivEl = $(".search-results");
let apiKey = "03cfdfb45efe945bd0f5f118d4004d6b";

let searchHistory = JSON.parse(localStorage.getItem("WeatherDashboard")) ||  [];

let apiUrl;
let todayDate = moment();
let cityCoord = {"lon": 0, "lat": 0};


let getCityCoordinates = function (city) {
    let apiUrlForCoord = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch (apiUrlForCoord)
        .then(response => response.json())
        .then(function(object) {
            cityCoord["lon"] = object.coord.lon;
            cityCoord["lat"] = object.coord.lat;
            getTodayWeather(cityCoord, city);
        })
}

let setWeatherIcon = function(condition) {
    let icon;
    switch (condition) {
    case "Clear": 
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/sun-512.png";
        break;
    case "Clouds":
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/cloud-512.png";
        break;
    case "Rain":
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/rain-cloud-512.png";
        "break";
    case "Thunderstorm":
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/flash-cloud-512.png";
        break;
    case "Snow":
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/snow-512.png"
        break;
    default:
        icon = "https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/sun-512.png";
        break;
    }
    return icon;
}

let displayTodayCard = function (todayObject, cityName) {
    let todayCard = $("<div>").addClass("card today-card");
    let weatherIcon = setWeatherIcon(todayObject.daily[0].weather[0].main);
    $("<h4>").addClass("card-title")
        .html(cityName + " <img height='2em' width='2em' src='" + weatherIcon + "' alt='404'>")
        .appendTo(todayCard);
    $("<h5>").addClass("card-title")
        .text(todayDate.format("l"))
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
    let fiveDayCard = $("<div>").addClass("five-day-display d-flex flex-column flex-lg-row justify-content-between");

    for (let i = 0; i < 5; i++) {
        let dayCard = $("<div>").addClass("card today-card");
        let weatherIcon = setWeatherIcon(fiveDayObject.daily[i+1].weather[0].main);

        $("<h5>").addClass("card-title")
            .text(todayDate.add(1, "days").format("l"))
            .appendTo(dayCard);
        $('<img>')
            .attr("src", weatherIcon)
            .appendTo(dayCard);
        $("<p>").addClass("today-temp card-text")
            .text("Temp: " + fiveDayObject.daily[i + 1].temp.day + " °F")
            .appendTo(dayCard);
        $("<p>").addClass("today-humidity card-text")
            .text("Humidity: " + fiveDayObject.daily[i + 1].humidity + "%")
            .appendTo(dayCard);
        /*$("<p>").addClass("today-wind-speed card-text")
            .text("Wind: " + fiveDayObject.daily[i + 1].wind_speed + " MPH")
            .appendTo(dayCard);
        let uviLevel = fiveDayObject.daily[i + 1].uvi;
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
            .appendTo(dayCard);
        */
        dayCard.appendTo(fiveDayCard);
    }

    fiveDayCard.appendTo(searchDivEl);
}

//create fetch function for today's forecast
let getTodayWeather = function(cityCoord, city) {

    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + cityCoord["lat"] + "&lon=" + cityCoord["lon"] + "&units=imperial&exclude=minutely&appid=" + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(function(obj) {
            displayTodayCard(obj, city);
            display5DayCard(obj, city);
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
    apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    let fiveDayData = fetch(apiUrl).then(response => response.json())
    console.log(fiveDayData);
}

//put search history in local storage
let updateSearchHistory = function(city, history) {
    if (!history.includes(city)) {
        history.push(city);
        $("<p>").addClass("city-search " + city).text(city).appendTo(".search-history");
        localStorage.setItem("WeatherDashboard", JSON.stringify(history));
    }
}

//NOT NEEDED!! FOR TESTING ONLY!!!
let testAPIData = function(apiUrl, city) {
    apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    let todayData = fetch(apiUrl)
        .then(response => response.json())
        .then(x => console.log(x));
}

//function for populating search results
let runSearch = function(event) {
    event.preventDefault();
    $(".search-results").empty();

    console.log(event.type);
    console.log(event.target);
    let cityName = $("#city-name").val();

    if (event.type === "click") {
        cityName = event.target.textContent;
    }
    
    getCityCoordinates(cityName);
    updateSearchHistory(cityName, searchHistory);
}

let populateSearchHistory = function() {
    for (let i = 0; i < searchHistory.length; i++) {
        $("<p>").addClass("city-search " + searchHistory[i]).text(searchHistory[i]).appendTo(".search-history")
    }
}

populateSearchHistory();

let testHandler = function(event) {
    let p = event.target
    console.log(p, event.type);
    console.log(p.textContent);
}

//event handler for submit on form
formEl.on("submit", runSearch);

//clicking a search history element to submit element
$(".search-history").on("click", "p", runSearch);