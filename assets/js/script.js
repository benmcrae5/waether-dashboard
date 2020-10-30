let formEl = $(".search-form")

//create fetch function for today's forecast
let getTodayForecast = function() {
    console.log("Today's forecast");
}
//create fetch function for five-day forecast
let getFiveDayForecast = function() {
    console.log("5-day forecast");
}
//function for populating search results
let runSearch = function(event) {
    event.preventDefault();
    let todayForecast = getTodayForecast();
    let fiveDatForecast = getFiveDayForecast();
}

//event handler for submit on form
formEl.on("submit", runSearch);