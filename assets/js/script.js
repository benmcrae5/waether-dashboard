let formEl = $(".search-form")
let apiKey = "03cfdfb45efe945bd0f5f118d4004d6b"

//create fetch function for today's forecast
let getTodayForecast = function(apiUrl) {
    console.log("Today's forecast");
    let todayData = fetch(apiUrl).then(response => response.json())
    console.log(todayData);
}

//create fetch function for five-day forecast
let getFiveDayForecast = function(apiUrl) {
    console.log("5-day forecast");

}

//function for populating search results
let runSearch = function(event) {
    event.preventDefault();
    cityName = $("#city-name").val();
    console.log(cityName);
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    let todayForecast = getTodayForecast(apiUrl);
    let fiveDatForecast = getFiveDayForecast(apiUrl);
}

//event handler for submit on form
formEl.on("submit", runSearch);