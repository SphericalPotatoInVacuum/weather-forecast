let cities, citiesAutocomplete = {};
let ids = {}
let weatherCard;
let cityName;
let progressBarWrapper, contentWrapper;
let temp, wind, cloud, rain;
let weatherIcon;

function loadJSON(path, success, error) {
    fetch(path)
        .then((response) => {
            return response.json();
        })
        .then(success)
        .catch(error);
}

document.addEventListener('DOMContentLoaded', function() {
    progressBarWrapper = document.getElementById('progress-bar-wrapper');
    contentWrapper = document.getElementById('content-wrapper');

    temp = document.getElementById('temp');
    wind = document.getElementById('wind');
    cloud = document.getElementById('cloudness');
    rain = document.getElementById('rain-volume');

    weatherIcon = document.getElementById('weather-icon');

    loadJSON('https://sphericalpotatoinvacuum.github.io/weather-forecast/ids.json', (data) => { ids = data }, (err) => { console.error(err) });
    loadJSON('https://sphericalpotatoinvacuum.github.io/weather-forecast/cities.json', (data) => {
        citiesAutocomplete = data;
        let elems = document.querySelectorAll('.autocomplete');
        let instances = M.Autocomplete.init(elems, {
            data: citiesAutocomplete,
            limit: 5
        });
        progressBarWrapper.remove();
        contentWrapper.style.display = 'block';
        weatherCard = document.getElementById('weather-card');
        cityName = document.getElementById('city-name');
    }, (err) => { console.error(err) });

});

function getWeather() {
    const autocomplete = document.getElementById('city-autocomplete');
    if (!autocomplete.value) {
        return alert('Enter your city name first, or use geolocation button');
    }
    let id = ids[autocomplete.value];
    if (id == undefined) {
        return alert('You should choose the city name from suggested results. We don\'t have information on other cities');
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${appid}&units=metric`;
    loadJSON(url, displayWeather, (err) => { console.error(err) });
}

function getByGeo() {
    if (!"geolocation" in navigator) {
        return alert('Geolocation services are not availible');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        let lon = position.coords.longitude;
        let lat = position.coords.latitude;
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&units=metric`;
        loadJSON(url, displayWeather, (err) => { console.error(err) });
    });
}

function displayWeather(weatherJson) {
    if (weatherJson.name) {
        cityName.innerText = weatherJson.name;
    } else {
        cityName.innerText = 'Your location';
    }
    weatherCard.classList.remove('scale-out');
    if (weatherJson.main.temp > 0) {
        temp.innerHTML = `+${weatherJson.main.temp}<sup>&#xb0;C</sup>`;
    } else {
        temp.innerHTML = `${weatherJson.main.temp}<sup>&#xb0;C</sup>`;
    }
    wind.innerHTML = `<i class="material-icons left" style="transform: rotate(${weatherJson.wind.deg}deg)">navigation</i>&nbsp;${weatherJson.wind.speed} m/s`;
    cloud.innerHTML = `<i class="material-icons left">cloud</i>&nbsp;${weatherJson.clouds.all}%`;
    if (weatherJson.rain) {
        rain.innerHTML = `<i class="material-icons left">opacity</i>&nbsp;${weatherJson.rain} mm / 3h`;
    } else {
        rain.innerHTML = `<i class="material-icons left">opacity</i>&nbsp;0 mm`;
    }
    let cond = weatherJson.weather[0].id;
    if (cond >= 200 && cond < 300) {
        weatherIcon.src = 'icons/thunder.svg';
    } else if (cond < 400) {
        weatherIcon.src = 'icons/rainy-6.svg';
    } else if (cond < 502) {
        weatherIcon.src = 'icons/rainy-2.svg';
    } else if (cond < 505) {
        weatherIcon.src = 'icons/rainy-3.svg';
    } else if (cond < 522) {
        weatherIcon.src = 'icons/rainy-5.svg';
    } else if (cond < 600) {
        weatherIcon.src = 'icons/rainy-6.svg';
    } else if (cond < 601) {
        weatherIcon.src = 'icons/snowy-1.svg';
    } else if (cond < 602) {
        weatherIcon.src = 'icons/snowy-3.svg';
    } else if (cond < 700) {
        weatherIcon.src = 'icons/snowy-6.svg';
    } else if (cond < 800) {
        weatherIcon.src = 'icons/cloudy.svg';
    } else if (cond < 801) {
        weatherIcon.src = 'icons/day.svg';
    } else if (cond < 802) {
        weatherIcon.src = 'icons/cloudy-day-1.svg';
    } else if (cond < 803) {
        weatherIcon.src = 'icons/cloudy-day-2.svg';
    } else if (cond < 804) {
        weatherIcon.src = 'icons/cloudy-day-3.svg';
    } else if (cond == 804) {
        weatherIcon.src = 'icons/cloudy.svg';
    }
}
