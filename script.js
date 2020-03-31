// Storing API Key into variable
var APIKey = 'f3d5f98330d1862e11ba7e4f8ac70fbb'; // Personal API key from https://openweathermap.org/api
var queryURL = '';
var todayDate = moment().format('LL'); // March 25, 2020 format

// Required document ready function (wrapper) to use jQuery
$(document).ready(function () {
	// Function to display searched cities list - local storage
	function displayInList() {
		// grab data from local storage
		var cities = JSON.parse(localStorage.getItem('cities'));
		if (!cities) {
			cities = [];
		}
		// loop the data
		for (i = 0; i < cities.length; i++) {
			var city = cities[i];
			//append cities to list container
			$('#searchedCityList').append('<li>' + city + '</li>');
		}
	}
	displayInList();

	// Initially hiding alert message that set for no value entered in citySearched field
	$('#alertMessage').hide();
	// Click handler of the search button
	$('#searchButton').on('click', function () {
		$('#searchedCityList').empty();
		$('#cityInfoBox').empty();
		$('#forecastDiv').empty();
		$('#forecastBoxesWrapper').empty();

		var citySearched = $('#searchField').val();
		var cities = JSON.parse(localStorage.getItem('cities'));
		if (cities) {
			cities.push(citySearched);
		} else {
			cities = [citySearched];
		}
		localStorage.setItem('cities', JSON.stringify(cities));
// ########### First API Call for Current Day (One Day) Weather ##########
// Conditionally keep it hiding or show the alert message
		if (!citySearched) {
			$('#alertMessage').show();
		} else {
			queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearched + '&units=Imperial&appid=' + APIKey;
			$('#alertMessage').hide();
		}
		$.ajax({
			url: queryURL,
			method: 'GET'
		}).then(function (response) {
			var tempFromAPI = response.main.temp;
			var kf_converter = (response.main.temp - 273.15) * 1.8 + 32;
			var kf_converted = kf_converter.toFixed(2);
			var currentHumidity = response.main.humidity;
			var currentWindSpeed = response.wind.speed;
			var currentWeatherIcon = response.weather[0].icon;
			var currentIconURL = "<img src='http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png' />";
			$('#cityInfoBox').append("<h4 class='dynamicH4'>" + response.name + " Current Weather" + currentIconURL + '</h4>');
			$('#cityInfoBox').append("<p class='dynamicP'>" + 'Temperature in (F) : ' + tempFromAPI + '&deg;' + '</p>' + "<p class='dynamicP'>" + 'Temperature in (K) : ' + kf_converted + '&deg;' + '</p>' + "<p class='dynamicP'>" + 'Humidity : ' + currentHumidity + '%' + "<p class='dynamicP'>" + 'Wind Speed : ' + currentWindSpeed + ' MPH' + '</p>' + "<p class='dynamicP'>" + "<p class='dynamicNote'>" + '</p>');

		// ########### Third API Call for UV Index - Nested inside First API call to receive data from third one and populate the data along other weather values ##########
			var latNumber = response.coord.lat;
			var lonNumber = response.coord.lon;
			var queryURL3 = 'https://api.openweathermap.org/data/2.5/uvi?appid=f3a53b113ee3edc1f98df25664c9486a&lat=' + latNumber + '&lon=' + lonNumber + '&appid=' + APIKey;
				$.ajax({
				url: queryURL3,
				method: 'GET'
			}).then(function (response) {
				$('#cityInfoBox').append("<p class='dynamicP'>" + 'UV Index : ' + response.value + "<p class='dynamicNote'>" + '** F: Fahrenheit, K: Kelvin temperature measurement' + '</p>');
				
			}); // Third API call for UVIndex ends - nested in first API call

		}); // First API call ends 

		// ########### Second API Call for 5-Day Forecast ##########
		var queryURL2 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + citySearched + '&appid=' + APIKey;
		$.ajax({
			url: queryURL2,
			method: 'GET'
		}).then(function (response) {
			$('#forecastDiv').append("<h4 class='dynamicH4'>" + '5-Day Weather Forecast : ' + response.city.name + '</h4>');
			$('#forecastDiv').append("<div id='forecastBoxesWrapper'>" + '</div>');

			var myList = response.list.length;
			for (var i = 0; i < myList; i += 8) {
				var dateFromAPI = response.list[i].dt_txt.substring(0, 10);
				nextDayDate = moment(dateFromAPI).format('MM/DD/YYYY');
				var kelvinConverter = (response.list[i].main.temp - 273.15) * 1.8 + 32;
				var kelvinConverted = kelvinConverter.toFixed(2);
				var humidityResult = response.list[i].main.humidity;
				var weatherIcons = response.list[i].weather[0].icon;
				var iconURL = "<img src='http://openweathermap.org/img/wn/" + weatherIcons + "@2x.png' />";
				$('#forecastBoxesWrapper').append("<div class='dailyForecastBox'>" + '<p>' + nextDayDate + '</p>' + '<p>' + iconURL + '</p>' + '<p>' + 'Temp: ' + kelvinConverted + '&deg;' + '</p>' + '<p>' + 'Humidity: ' + humidityResult + '%' + '</p>' + "</div>");
			}
		}); // Second API call ends 

	}); // on click event handler ends 

}); // document ready function (wrapper) ends here.
