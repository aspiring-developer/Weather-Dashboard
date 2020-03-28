// Initializing variables
var APIKey = 'f3d5f98330d1862e11ba7e4f8ac70fbb';
var queryURL = '';
var todayDate = moment().format('LL');

var futureDate1 = moment().format('l'); // 3/25/2020 format
var futureDate2 = moment()
	.add(1, 'days')
	.calendar(); // Tomorrow at 4:57 PM

//displayInList();

// Required document ready function (wrapper) to use jQuery
$(document).ready(function() {
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
	$('#searchButton').on('click', function() {
		$('#searchedCityList').empty();
		$('#cityInfoBox').empty();
		$('#forecastDiv').empty();

		var citySearched = $('#searchField').val();
		var cities = JSON.parse(localStorage.getItem('cities'));
		if (cities) {
			cities.push(citySearched);
		} else {
			cities = [citySearched];
		}
		// console.log(cities);
		localStorage.setItem('cities', JSON.stringify(cities));

		// Conditionally keep hiding or showing the alert message
		if (!citySearched) {
			$('#alertMessage').show();
		} else {
			queryURL =
				'https://api.openweathermap.org/data/2.5/weather?q=' +
				citySearched +
				'&units=Imperial&appid=' +
				APIKey;

			$('#alertMessage').hide();
		}

		// NEW API CALL for 5 Days
		var queryURL2 =
			'https://api.openweathermap.org/data/2.5/forecast?q=' +
			citySearched +
			'&appid=' +
			APIKey;
		$.ajax({
			url: queryURL2,
			method: 'GET'
		}).then(function(response) {
		
			// $$$$$$$$$$$$$$$$$$$$ CURRENT WORK IN PROCESS BLOCK $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				// Dynamically creating and appending a wrapper div that will 5-day forecast boxes
				$('#forecastDiv').append("<div id='forecastBoxesWrapper'>" + '</div>');
				// Dynamically creating and appending a container div that will display 5-day forecast 
				$('#forecastBoxesWrapper').append(
					"<div class='dailyForecastBox'>" + "</div>"
				);// looping the 5-day forecast data

			var myList = response.list.length;
			for (var i = 0; i < myList; i += 8) {
				var dateFromAPI = response.list[i].dt_txt.substring(0, 10);
				nextDayDate = moment(dateFromAPI).format('MM/DD/YYYY');
				console.log(dateFromAPI);
				console.log(response.list[i].dt_txt);
				console.log(response.list[i].main.temp);
				console.log(response.list[i].weather[0].icon);
				console.log(response.list[i].main.humidity);
				console.log(response);
				console.log(nextDayDate);
				$('#forecastBoxesWrapper').append(
					"<div class='dailyForecastBox'>" + nextDayDate + imageIconURL + kelvinConverted +
					response.list[i].main.humidity + "</div>"

				);
				var imageIconURL =
				'http://openweathermap.org/img/wn/' +
				response.list[i].weather[0].icon +
				'.png';
			var kelvinConverter = (response.list[i].main.temp - 273.15) * 1.8 + 32;
			var kelvinConverted = kelvinConverter.toFixed(2);
			console.log(imageIconURL);
			$('.dailyForecastBox').append('<p>' +	nextDayDate +	'</p>' + '<img src=' + imageIconURL +	'/>' + '<br>' +	'<p>' +	'Temp: ' + kelvinConverted + '&deg;' + '<br>' +	'Humidity: ' +	response.list[i].main.humidity + '%' + '</p>' +	'</div>'
			);

			}

			// Dynamically appending h4 that will display 5-day forecast header
			$('#forecastDiv').append(
				"<h4 class='dynamicH4'>" +
					'5-Day Weather Forecast of ' +
					response.city.name +
					'</h4>'
			);
		

			// http://openweathermap.org/img/wn/10d@2x.png

			// var imageIconURL =
			// 	'http://openweathermap.org/img/wn/' +
			// 	response.list[i].weather[0].icon +
			// 	'.png';
			// var kelvinConverter = (response.list[i].main.temp - 273.15) * 1.8 + 32;
			// var kelvinConverted = kelvinConverter.toFixed(2);
			// console.log(imageIconURL);
		

			// $$$$$$$$$$$$$$$$$$$$ WORK IN PROCESS BLOCK THIS LINE ABOVE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
		});
		// NEW API CALL ABOVE

		$.ajax({
			url: queryURL,
			method: 'GET'
		})
			// Store all retrieved data in "response" object.
			.then(function(response) {
				//The API gives temperature measurement in Kelvin, so changing it to fahrenheit
				var kelvinToFahrenheit = (response.main.temp - 273.15) * 1.8 + 32;

				// Dynamically appending h4 and p html-elements, and displaying data in them
				$('#cityInfoBox').append(
					"<h4 class='dynamicH4'>" +
						response.name +
						"'s" +
						' Weather Info: ' +
						'&nbsp;&nbsp;&nbsp;&nbsp;  ' +
						todayDate +
						"<img src='weather1.png'>" +
						'</h4>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicP'>" +
						'Temperature in (F) : ' +
						response.main.temp +
						'&deg;' +
						'</p>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicP'>" +
						'Temperature in (K) : ' +
						kelvinToFahrenheit.toFixed(2) +
						'&deg;' +
						'</p>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicP'>" +
						'Humidity : ' +
						response.main.humidity +
						'%' +
						'</p>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicP'>" +
						'Wind Speed : ' +
						response.wind.speed +
						' MPH' +
						'</p>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicP'>" + 'UV Index : ' + response.main.temp + '</p>'
				);
				$('#cityInfoBox').append(
					"<p class='dynamicNote'>" +
						'** F: Fahrenheit, K: Kelvin temperature measurement' +
						'</p>'
				);

						});
	});
}); // document ready function (wrapper) ends here.
