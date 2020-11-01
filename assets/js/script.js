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
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
        })
        .then(function(object) {
            if (object) {
                cityCoord["lon"] = object.coord.lon;
                cityCoord["lat"] = object.coord.lat;
                getTodayWeather(cityCoord, city);
            }
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
        break;
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

//uses API info to create dynamic HTML display for today's forecast
let displayTodayCard = function (todayObject, cityName) {
    let todayCard = $("<div>").addClass("card today-card");
    let weatherIcon = setWeatherIcon(todayObject.daily[0].weather[0].main);
    $("<h4>")
        .addClass("card-title")
        .html(cityName + " <img height='2em' width='2em' src='" + weatherIcon + "' alt='404'>")
        .appendTo(todayCard);
    $("<h5>")
        .addClass("card-title")
        .text(todayDate.format("l"))
        .appendTo(todayCard);
    $("<p>")
        .addClass("today-temp card-text")
        .text("Temperature: " + todayObject.daily[0].temp.day + " °F")
        .appendTo(todayCard);
    $("<p>")
        .addClass("today-humidity card-text")
        .text("Humidity: " + todayObject.daily[0].humidity + "%")
        .appendTo(todayCard);
    $("<p>")
        .addClass("today-wind-speed card-text")
        .text("Wind Speed: " + todayObject.daily[0].wind_speed + " MPH")
        .appendTo(todayCard);
    let uviLevel = todayObject.daily[0].uvi;
    let uviSpan;
    if (uviLevel >= 0 && uviLevel < 3) {
        uviSpan = '<span class="bg-success">' + uviLevel + '</span>';
    } else if (uviLevel >= 3 && uviLevel < 7) {
        uviSpan = '<span class="bg-warning">' + uviLevel + '</span>';
    } else {
        uviSpan = '<span class="bg-danger">' + uviLevel + '</span>';
    }
    $("<p>")
        .addClass("today-uvindex card-text")
        .html("UV Index: " + uviSpan)
        .appendTo(todayCard);

    todayCard.appendTo(searchDivEl);
}

//uses API info to create dynamic HTML display for the 5-day forecast
let display5DayCard = function (fiveDayObject, cityName) {
    let fiveDayCard = $("<div>").addClass("five-day-display");
    $("<h3>")
        .addClass("five-day-title")
        .text("5-Day Forecast: ")
        .appendTo(fiveDayCard);
    let cardHolder = $("<div>")
        .addClass("five-day-card-holder d-flex flex-column flex-lg-row justify-content-between")
        .appendTo(fiveDayCard)
    for (let i = 0; i < 5; i++) {
        let dayCard = $("<div>").addClass("card today-card");
        let weatherIcon = setWeatherIcon(fiveDayObject.daily[i+1].weather[0].main);

        $("<h5>")
            .addClass("card-title")
            .text(todayDate.add(1, "days").format("l"))
            .appendTo(dayCard);
        $('<img>')
            .attr("src", weatherIcon)
            .appendTo(dayCard);
        $("<p>")
            .addClass("today-temp card-text")
            .text("Temp: " + fiveDayObject.daily[i + 1].temp.day + " °F")
            .appendTo(dayCard);
        $("<p>")
            .addClass("today-humidity card-text")
            .text("Humidity: " + fiveDayObject.daily[i + 1].humidity + "%")
            .appendTo(dayCard);

        dayCard.appendTo(cardHolder);
    }

    fiveDayCard.appendTo(searchDivEl);
}

//create fetch function for today's forecast
let getTodayWeather = function(cityCoord, city) {

    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityCoord["lat"] + "&lon=" + cityCoord["lon"] + "&units=imperial&exclude=minutely&appid=" + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(function(obj) {
            displayTodayCard(obj, city);
            display5DayCard(obj, city);
            updateSearchHistory(city, searchHistory);
        });
}

//create fetch function for five-day forecast
let getFiveDayForecast = function(apiUrl, city) {
    apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    let fiveDayData = fetch(apiUrl).then(response => response.json())
}

//update the search history variable and UI, then put search history in local storage
let updateSearchHistory = function(city, history) {
    if (!history.includes(city)) {
        history.push(city);
        $("<p>")
            .addClass("city-search " + city)
            .text(city)
            .appendTo(".search-history");
        localStorage.setItem("WeatherDashboard", JSON.stringify(history));
    }
}

//function for populating search results
let runSearch = function(event) {
    event.preventDefault();
    $(".search-results").empty();

    let cityName = $("#city-name").val();
    if (event.type === "click") {
        cityName = event.target.textContent;
    }

    getCityCoordinates(cityName);
}

let populateSearchHistory = function() {
    for (let i = 0; i < searchHistory.length; i++) {
        $("<p>")
            .addClass("city-search " + searchHistory[i]).text(searchHistory[i])
            .appendTo(".search-history")
    }
}

populateSearchHistory();

//event handler for submit on form
formEl.on("submit", runSearch);

//clicking a search history element to submit element
$(".search-history").on("click", "p", runSearch);