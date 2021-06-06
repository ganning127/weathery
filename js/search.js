
var i = 0;
var txt = 'Weathery'; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
    document.querySelector(".title-text").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
typeWriter()

const apiKey = "17deabb0b329fd01a5c6eb5c05c7cb29"
const form = document.getElementById("weatherForm");

form.addEventListener("submit", e => {
    e.preventDefault();
    let city = document.getElementById("city").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    // current forecast
    fetch(url)
        .then(response => {
          return response.json()
        })
        .then(data => {

            main = data.main;
            weather = data.weather;
            sys = data.sys;
            name = data.name;

            country = data.sys.country;
            city = data.name


            const icon = `https://openweathermap.org/img/wn/${
  weather[0]["icon"]
}@2x.png`;

            setLocation(city, country);
            setFeelsLike(data.main.feels_like)
            setCurrentTemp(data.main.temp)
            setConditions(icon)


            document.querySelector('#output_data').scrollIntoView({
                behavior: 'smooth'
            });
        })

        .catch(() => {
            alert("Enter a valid city in the following format: [City] OR [City, Country]")
            return;
        });

    document.getElementById("weatherForm").reset();

    // hourly forecast
    const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    console.log(hourlyUrl)
    fetch(hourlyUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        city = data.city.name;
        country = data.city.country;
        timezone = data.city.timezone

        let counter = 0;
        for (let i=0; i<4; i++) {
          const arrayItem = data.list[i]
          let timeElement = document.getElementById("time" + counter);
          let tempElement = document.getElementById("temp" + counter);
          let iconElement = document.getElementById("icon" + counter);
          let rainElement = document.getElementById("rain" + counter);
          let windElement = document.getElementById("wind" + counter);

          setHourlyTime(timeElement, arrayItem.dt, timezone);

          setHourlyTemp(tempElement, arrayItem.main.temp);
          setHourlyIcon(iconElement, arrayItem.weather[0].icon, arrayItem.weather[0].main);
          setHourlyRain(rainElement, arrayItem.pop);
          setHourlyWind(windElement, arrayItem.wind.speed);
          setHourlyLocation(city, country);
          counter += 1;
        }


      })
      document.querySelector(".ajax-section").classList.remove("hidden");
});




function setLocation(city, country) {
    if (country === undefined) {
      document.getElementById("location").innerHTML = `Weather for ${city}`
      return;
    }
    document.getElementById("location").innerHTML = `Weather for ${city}, ${country}`
}

function setFeelsLike(temp) {
    document.querySelector("#feels-like p").innerHTML = Math.round(temp) + "&deg;F";
}

function setCurrentTemp(temp) {
    document.querySelector("#temp p").innerHTML = Math.round(temp) + "&deg;F";
}

function setConditions(iconUrl) {
    document.querySelector("#cond img").src = iconUrl;
}

function setHourlyLocation(city, country) {
  if (country === "") {
    document.getElementById("hourly").innerHTML = `Hourly Weather Data for ${city}`
    return
  }
  document.getElementById("hourly").innerHTML = `Hourly Weather Data for ${city}, ${country}`
}

function setHourlyTime(element, unixTime, timezone) {
  unixTime *= 1000
  timezone *= 1000

  var myDate = new Date(unixTime + timezone)
  var dateString = myDate.toGMTString()
  var strippedString = dateString.substring(16,22)


  if (parseInt(strippedString.substring(0,3)) > 12) {
    var useDate = (parseInt(strippedString.substring(0,3) - 12)) + strippedString.substring(3, strippedString.length +1) + "PM"
  }
  else {
    var useDate = strippedString.substring(2,strippedString.length + 1) + "AM"
  }


  element.innerHTML = useDate;
}

function setHourlyTemp(element, temp) {
  element.innerHTML = Math.round(temp) + " &deg;F";
}

function setHourlyIcon(element, icon, alt) {
  element.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  element.alt = alt;
}

function setHourlyRain(element, percent) {
  element.innerHTML = Math.round(percent*100) + "% chance of rain."
}

function setHourlyWind(element, speed) {
  element.innerHTML = Math.round(speed) + " mph winds."
}
