// Initializing variables
var APIKey = 'f3d5f98330d1862e11ba7e4f8ac70fbb'; // Personal API key from https://openweathermap.org/api
var queryURL = '';
var todayDate = moment().format('LL'); // March 25, 2020 format

// Required document ready function (wrapper) to use jQuery
$(document).ready(function () {
	// Function to display searched cities list
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

	// Initially hiding alert message that set for no value entered in search field
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

		// Conditionally keep hiding or showing the alert message
		if (!citySearched) {
			$('#alertMessage').show();
		} else {
			queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearched + '&units=Imperial&appid=' + APIKey;
			$('#alertMessage').hide();
		}
// $$$$$$$$$$$$$$$$$$$$$ CURRENTLY WORKING IN THIS SECTION $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

$.ajax({
	url: queryURL,
	method: 'GET'
}).then(function (response) {
// without looping works, but looping NO!!!!!!!!!!!!
// $('#cityInfoBox').append("<h4 class='dynamicH4'>" +	response.name +	"'s" + '</h4>');
// console.log(response.name);  // WORKING FINE HERE, BUT NOT INSIDE LOOP!!!!!!!!!!!
	console.log(response);
	console.log("working!!!!!!!!!!!!!!!!!!!!");
		var tempFromAPI = response.main.temp;
		var kf_converter = (response.main.temp - 273.15) * 1.8 + 32;
		var kf_converted = kf_converter.toFixed(2);
		var currentHumidity = response.main.humidity;
		var currentWindSpeed = response.wind.speed;
		var currentWeatherIcon = response.weather[0].icon;
		var currentIconURL = "<img src='http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png' />";
console.log(currentWeatherIcon);
console.log(currentIconURL); 
	// }
	$('#cityInfoBox').append("<h4 class='dynamicH4'>" +	response.name +	" Current Weather" + currentIconURL + '</h4>');
	$('#cityInfoBox').append("<p class='dynamicP'>"  +	'Temperature in (F) : ' +	tempFromAPI + '&deg;' + '</p>' + "<p class='dynamicP'>" +	'Temperature in (K) : ' +	kf_converted +	'&deg;' +	'</p>' + "<p class='dynamicP'>" +	'Humidity : ' +	currentHumidity +	'%' +	"<p class='dynamicP'>" +	'Wind Speed : ' +	currentWindSpeed +	' MPH' +'</p>' + "<p class='dynamicP'>" + 'UV Index : ' + tempFromAPI + "<p class='dynamicNote'>" +	'** F: Fahrenheit, K: Kelvin temperature measurement' + '</p>');

});

// $$$$$$$$$$$$$$$$$$$$$ CURRENTLY WORKING THE SECTION ABOVE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
		// NEW API CALL for 5 Days
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
				// console.log(response.list[i].weather[0].icon);
				// console.log(response);
				var kelvinConverter = (response.list[i].main.temp - 273.15) * 1.8 + 32;
				var kelvinConverted = kelvinConverter.toFixed(2);
				var humidityResult = response.list[i].main.humidity;
				var weatherIcons = response.list[i].weather[0].icon;
				var iconURL = "<img src='http://openweathermap.org/img/wn/" + weatherIcons + "@2x.png' />";
				$('#forecastBoxesWrapper').append("<div class='dailyForecastBox'>" + '<p>' + nextDayDate + '</p>' + '<p>' + iconURL + '</p>' + '<p>' + 'Temp: ' + kelvinConverted + '&deg;' + '</p>' + '<p>' + 'Humidity: ' + humidityResult + '%' + '</p>' + "</div>");
			}
		});
		// NEW API CALL ABOVE


				
	});
}); // document ready function (wrapper) ends here.
