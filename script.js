// Initializing variables
var APIKey = 'f3d5f98330d1862e11ba7e4f8ac70fbb';
var queryURL = '';
var todayDate = moment().format('LL'); 

var futureDate1 = moment().format('l');  // 3/25/2020 format
var futureDate2 = moment().add(1, 'days').calendar(); // Tomorrow at 4:57 PM
console.log(futureDate1);
console.log(futureDate2);



// Required document ready function (wrapper) to use jQuery
$(document).ready(function() {
  // Initially hiding alert message that set for no value entered in search field
  $('#alertMessage').hide();
  // Click handler of the search button
	$('#searchButton').on('click', function() {
		$('#searchedCityList').empty();
		$('#cityInfoBox').empty();
		$('#forecastDiv').empty();

		var citySearched = $('#searchField').val();
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
		$.ajax({
			url: queryURL,
			method: 'GET'
		})
			// Store all retrieved data in "response" object.
			.then(function(response) {
				console.log('Working codes above!'); // Working fine!
 //The API gives temperature measurement in Kelvin, so changing it to fahrenheit
        var kelvinToFahrenheit = (response.main.temp - 273.15) * 1.80 + 32;
 // Dynamically appending h4 and p html-elements, and displaying data in them
        $("#cityInfoBox").append("<h4 class='dynamicH4'>" + response.name + "'s" + " Weather Info: " + "&nbsp;&nbsp;&nbsp;&nbsp;  " + todayDate + "<img src='weather1.png'>" + "</h4>");
        $("#cityInfoBox").append("<p class='dynamicP'>" + "Temperature in (F) : " + response.main.temp + "&deg;" + "</p>");
        $("#cityInfoBox").append("<p class='dynamicP'>" + "Temperature in (K) : " + kelvinToFahrenheit.toFixed(2) + "&deg;" +  "</p>");
        $("#cityInfoBox").append("<p class='dynamicP'>" + "Humidity : " + response.main.humidity + "%" + "</p>");
        $("#cityInfoBox").append("<p class='dynamicP'>" + "Wind Speed : " + response.wind.speed + " MPH" + "</p>");
        $("#cityInfoBox").append("<p class='dynamicP'>" + "UV Index : " + response.main.temp + "</p>");
        $("#cityInfoBox").append("<p class='dynamicNote'>" + "** F: Fahrenheit, K: Kelvin temperature measurement" + "</p>");
 // Dynamically appending h4 that will display 5-day forecast header
        $("#forecastDiv").append("<h4 class='dynamicH4'>" + "5-Day Weather Forecast of " + response.name + "</h4>");

        console.log(response.name + "'s" + " Weather Info");
        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature in Kelvin: " + kelvinToFahrenheit);
        console.log("Temperature in Fahrenheit: " + response.main.temp);
// ============== Working ok up to above line =================== //

// $$$$$$$$$$$$$$$$$$$$ CURRENT WORK IN PROCESS BLOCK $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 

  //  $("#forecastDiv").append("<div class='dailyForecastBox'>" + futureDate1 + "<br>" + "<img src='weather1.png'>" + response.main.temp + "&deg;" + "<br>" + response.main.humidity + "</div>");
   $("#forecastDiv").append("<div class='dailyForecastBox'>" + "</div>");
   $(".dailyForecastBox").append("<p>" + futureDate2 + "</p>" + "<br>" + "<img src='weather1.png'>" + "<br>" + response.main.temp + "&deg;" + "<br>" + response.main.humidity + "</div>");
   $("#forecastDiv").append("<div class='dailyForecastBox'>" + "</div>");
   $("#forecastDiv").append("<div class='dailyForecastBox'>" + "</div>");
   $("#forecastDiv").append("<div class='dailyForecastBox'>" + "</div>");
   $("#forecastDiv").append("<div class='dailyForecastBox'>" + "</div>");



// $$$$$$$$$$$$$$$$$$$$ WORK IN PROCESS BLOCK THIS LINE ABOVE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 


      });
     
	});
}); // document ready function (wrapper) ends here.
