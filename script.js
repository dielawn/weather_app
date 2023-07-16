const containerDiv = document.getElementById('container')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')

let city 
const data = []
let isMetric = false

function handleCityValue() {
    if (!searchInput.value) {
        city = 'Bozeman'
    } else {
        city = searchInput.value
    }
    
}

searchBtn.addEventListener('click', () => {
    handleCityValue()
    getForecastData()

})


handleCityValue()
// getCurrentData()


async function getForecastData() {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fc4b3c660cmsh267568b5d8c8b79p1cadfcjsnd7198f8a0b37',
		'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text()
    let string = `{"key": ${result}}`
    let object = JSON.parse(string)
    data.length = 0
    data.push(object)
    console.log(data)   
    logStuff()

} catch (error) {
	console.error(error);
}
}



function logStuff() {
    console.log(data)
    console.log( getCityName())    
    console.log(getCurrentTemp())
    console.log(getCurrentText())
    console.log(getCurrentPrecip())
    console.log(getWindDir())
    console.log(getWindSpeed())
    console.log(getWindGust())
    console.log(getUv())
    console.log(getCloud())
    getHourlyData()
    console.log(hourlyForecast)


}

getForecastData()

function getCityName() {
    let cityName = data[0].key.location.name
    return cityName
}

//current stuff

function getCurrentTemp() {
    let currentTemp 
    if (isMetric) {
        currentTemp = data[0].key.current.temp_c
    } else {
        currentTemp = data[0].key.current.temp_f
    }
    return currentTemp
}

function getCurrentText() {
    let text = data[0].key.current.condition.text
    return text
}

function getCurrentIcon() {
    let icon = data[0].key.current.condition.icon
    return icon
}

function getCurrentPrecip() {
    let precip
    if (isMetric) {
        precip = data[0].key.current.precip_mm
    } else {
        precip = data[0].key.current.precip_in
    }
    return precip
}

function getWindDir() {
    let windDir = data[0].key.current.wind_dir
    return windDir
}

function getWindSpeed() {
    let windSpeed
    if (isMetric) {
        windSpeed = data[0].key.current.wind_kph
    } else {
        windSpeed = data[0].key.current.wind_mph
    }
    return windSpeed
}

function getWindGust() {
    let windGust
    if (isMetric) {
        windGust = data[0].key.current.gust_kph
    } else {
        windGust = data[0].key.current.gust_mph
    }
    return windGust
}

function getUv() {
    let uv = data[0].key.current.uv
    return uv
}

function getCloud() {
    let cloud = data[0].key.current.cloud
    return cloud
}



//forecast
let hourlyForecast = []
function getHourlyData() {
    hourlyForecast.length = 0
    let date
    for (let i = 0; i < 24; i++) {
        let timeDate = data[0].key.forecast.forecastday[0].hour[i].time
        let splitDateTime = timeDate.split(" ")
        date = splitDateTime[0]
        let time = splitDateTime[1]
        let temp 
        if (isMetric) {
            temp = data[0].key.forecast.forecastday[0].hour[i].temp_c
        } else {
            temp = data[0].key.forecast.forecastday[0].hour[i].temp_f
        }
        let is_day = Boolean(data[0].key.forecast.forecastday[0].hour[i].is_day)
       hourlyForecast.push({
        date: date,
        time: time,
        temp: temp,
        isday: is_day
    })
    }
    return hourlyForecast
}

