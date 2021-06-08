// Weathery typewriter effect
var i = 0;
var txt = 'Weathery';
var speed = 50;

function typeWriter() {
	if (i < txt.length) {
		document.querySelector(".title-text").innerHTML += txt.charAt(i);
		i++;
		setTimeout(typeWriter, speed);
	}
}

typeWriter()

var cardsInSlide = 10; // create new swiper slides
var locationLat;
var locationLon;

function init() {
	const swiper = new Swiper('.swiper-container', {
		autoplay: {
			delay: 10000,
		},

		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',

		},
		observer: true,
		observeParents: true
	});

	const apiKey = "17deabb0b329fd01a5c6eb5c05c7cb29"
	const form = document.getElementById("weatherForm");

	form.addEventListener("submit", e => {
		document.querySelector('.swiper-wrapper').innerHTML = "";
		e.preventDefault();
		let city = document.getElementById("city").value;

		if (/^\d/.test(city)) {
			let locations = city.split(",");
			if (locations.length == 1) {
				var url = `https://api.openweathermap.org/data/2.5/weather?zip=${city},US&appid=${apiKey}&units=imperial`;
			} else {
				zip = locations[0].trim();
				country = locations[1].trim();
				var url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${apiKey}&units=imperial`;
			}

		} else {
			var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
		}


		// current forecast
		fetch(url)
			.then(response => {
				if (response.ok) {
					document.querySelector(".ajax-section").classList.remove("hidden");
					document.querySelector('.error-text').classList.add("hidden");
				}
				return response.json()
			})
			.then(data => {
				main = data.main;
				weather = data.weather;
				name = data.name;
				timezone = data.timezone;
				sunrise = data.sys.sunrise;
				sunset = data.sys.sunset;

				locationLat = data.coord.lat;
				locationLon = data.coord.long;

				country = data.sys.country;
				city = data.name


				const icon = `https://openweathermap.org/img/wn/${
    weather[0]["icon"]
  }@2x.png`;

				setLocation(city, country);
				setFeelsLike(data.main.feels_like)
				setCurrentTemp(data.main.temp)
				setConditions(icon)
				setSunrise(sunrise, timezone)
				setSunset(sunset, timezone);

				document.querySelector('#output_data').scrollIntoView({
					behavior: 'smooth'
				});
			})

			.catch(() => {
				document.querySelector('.error-text').classList.remove("hidden");
				return;
			});

		// Hourly forecast
		const hourlyUrl = url.replace("data/2.5/weather", "data/2.5/forecast")

		fetch(hourlyUrl)
			.then(response => response.json())
			.then(data => {
				city = data.city.name;
				country = data.city.country;
				timezone = data.city.timezone
				setHourlyLocation(city, country);

				for (let i = 0; i < data.list.length; i++) {
					const arrayItem = data.list[i]
					createHourly(arrayItem, timezone);
				}
			})

		document.getElementById("weatherForm").reset();
	});


};

function createHourly(arrayItem, timezone) {
	let cardContainer = document.createElement('div');

	if (parseInt(window.screen.width) <= 768) {
		cardContainer.classList.add("col-4");
		var numPerSlide = 2;

		document.getElementById("left-button").classList.add("hidden");
		document.getElementById("right-button").classList.add("hidden");
	} else {
		cardContainer.classList.add("col-2");
		var numPerSlide = 4;
	}

	cardContainer.classList.add("hourly-content");
	cardContainer.classList.add("text-center");

	let timeDate = document.createElement('h5');
	timeDate.classList.add("text-center");
	timeDate.classList.add("pt-3");
	timeDate.innerHTML = "<span class='items'>" + getHourlyTime(arrayItem.dt, timezone) + "</span>";


	let iconImg = document.createElement('img');
	iconImg.classList.add("hourly-icon");
	icon = arrayItem.weather[0].icon;
	iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	iconImg.alt = arrayItem.weather[0].main;


	let temp = document.createElement('p');
	temp.classList.add('hourly-data');
	temp.innerHTML = "<span class='temp'>" + Math.round(arrayItem.main.temp) + "&deg;F</span>";

	let rain = document.createElement("p")
	rain.classList.add('hourly-data');
	rain.innerHTML = "<span class='chance-rain'>" + Math.round(arrayItem.pop * 100) + "&percnt;</span> " + " chance of rain.";

	let wind = document.createElement("p")
	wind.classList.add('hourly-data');
	wind.innerHTML = "<span class='wind-speed'>" + Math.round(arrayItem.wind.speed) + "</span>" + " mph winds.";


	cardContainer.appendChild(timeDate);
	cardContainer.appendChild(iconImg);
	cardContainer.appendChild(temp);
	cardContainer.appendChild(rain);
	cardContainer.appendChild(wind);


	if (cardsInSlide >= numPerSlide) {
		let newSlide = document.createElement('div');
		newSlide.classList.add("swiper-slide");

		let newSlideRow = document.createElement('div');
		newSlideRow.classList.add("row");
		newSlideRow.classList.add("d-flex");
		newSlideRow.classList.add("justify-content-center");

		newSlide.appendChild(newSlideRow)

		document.querySelector('.swiper-wrapper').appendChild(newSlide);
		cardsInSlide = 0;

	}

	// less than 4 cards so far
	let currentSlide = document.querySelector(".swiper-wrapper").lastElementChild;

	let currentSlideRow = currentSlide.lastElementChild;
	currentSlideRow.appendChild(cardContainer)
	cardsInSlide += 1;
}

// Current Weather Functions
function setLocation(city, country) {
	if (country === undefined) {
		document.getElementById("location").innerHTML = `Weather for ${city}`
		return;
	}
	document.getElementById("location").innerHTML = `Weather for ${city}, ${country}`
}

function setFeelsLike(temp) {
	document.querySelector("#feels-like span").innerHTML = Math.round(temp) + "&deg;F";
}

function setCurrentTemp(temp) {
	document.querySelector("#temp span").innerHTML = Math.round(temp) + "&deg;F";
}

function setConditions(iconUrl) {
	document.querySelector("#cond img").src = iconUrl;
}

function setSunrise(sunrise, timezone) {
	time = getHourlyTime(sunrise, timezone);
	formattedTime = time.substring(4, time.length + 1);
	document.querySelector("#sunrise span").innerHTML = formattedTime;
}

function setSunset(sunset, timezone) {
	time = getHourlyTime(sunset, timezone);
	formattedTime = time.substring(4, time.length + 1);
	document.querySelector("#sunset span").innerHTML = formattedTime;
}

// Hourly Weather Functions
function getHourlyTime(unixTime, timezone) {
	// takes unixTime and timezone in unix epoch seconds and returns local time
	var myDate = new Date(unixTime * 1000 + timezone * 1000);
	var dateString = myDate.toGMTString();
	var dayOfWeek = dateString.substring(0, 3);
	var strippedString = dateString.substring(16, 22);

	if (parseInt(strippedString.substring(0, 3)) > 12) {
		var useDate = (parseInt(strippedString.substring(0, 3) - 12)) + strippedString.substring(3, strippedString.length + 1) + " PM"
	} else {
		if ((strippedString.substring(1, 2)) == "0") {
			// 08:00
			var useDate = strippedString.substring(2, strippedString.length + 1) + " AM"
		} else {
			var useDate = strippedString + " AM"
		}
	}
	return dayOfWeek + " " + useDate;
}

function setHourlyLocation(city, country) {
	if (country === "") {
		document.getElementById("hourly").innerHTML = `Hourly Weather Data for ${city}`
		return
	}
	document.getElementById("hourly").innerHTML = `Hourly Weather Data for ${city}, ${country}`
}


init();
