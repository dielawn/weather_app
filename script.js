const containerDiv = document.getElementById('container')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')

let city 
let cityObject 

function handleCityValue() {
    if (!searchInput.value) {
        city = 'Bozeman'
    } else {
        city = searchInput.value
    }
    
}

searchBtn.addEventListener('click', () => {
    handleCityValue()
   return getData()
})



async function getWeatherData() {
    const url = `https://forecast9.p.rapidapi.com/rapidapi/forecast/${city}/summary/`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fc4b3c660cmsh267568b5d8c8b79p1cadfcjsnd7198f8a0b37',
            'X-RapidAPI-Host': 'forecast9.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        let string = `{"key": ${result}}`;
        let object = JSON.parse(string);
        cityObject = object
        console.log((object.key.location.name))
        console.log((object.key.forecast.items))
        tempData()
        
    } catch (error) {
        console.error(error);
    }
}

function tempData() {
   console.log((cityObject.key.forecast.items.length))
   let tempData = cityObject.key.forecast.items
   console.log(tempData[0])
   for (const data of tempData) {
    console.log(`Min: ${data.temperature.min} Max: ${data.temperature.max}`)
    console.log(data.date)
    console.log(city)
    // console.log(`Precipitation; ${data.prec} Probability: ${data.prec.probability}`)
    
   }
    
   
   
}

// handleCityValue()
// getWeatherData()




async function getCurrentData() {
    
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fc4b3c660cmsh267568b5d8c8b79p1cadfcjsnd7198f8a0b37',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options)
        const result = await response.text()
        let string = `{"key": ${result}}`
        let object = JSON.parse(string)
        const currentObjectKey = object.key.current

        console.log(`City of ${object.key.location.name}`)
        console.log(`${currentObjectKey.temp_c}\u00B0 c`)
        console.log(`${currentObjectKey.temp_f}\u00B0 f`)
        console.log(`${currentObjectKey.condition.text}`)
        console.log(`${currentObjectKey.condition.icon}`)
        // console.log(`Precip: ${}`)
        console.log(`Wind: ${currentObjectKey.wind_kph} Gust: ${currentObjectKey.gust_kph}`)
        console.log(`Wind: ${currentObjectKey.wind_mph} Gust: ${currentObjectKey.gust_mph}`) 
        console.log(`Humidity: ${currentObjectKey.humidity}`)
        console.log(`Uv: ${currentObjectKey.uv}`)
        console.log(`Is Day: ${currentObjectKey.is_day}`)
        console.log(`Updated: ${currentObjectKey.last_updated}`)
        console.log(`Precip in: ${currentObjectKey.precip_in}`)
        console.log(`Precip mm: ${currentObjectKey.precip_mm}`)
        console.log(currentObjectKey)
    } catch (error) {
        console.error(error)
    }
}


handleCityValue()
// getCurrentData()
const data = []



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

let isMetric = true

function logStuff() {
    console.log(data)
    console.log( getCityName())    
    console.log(getCurrentTemp())
    console.log(getCurrentText())
    console.log(getCurrentPrecip())
    console.log(getWindDir())


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

//forecast


function getMinTempC() {
    let minTempC = data[0].key.forecast.forecastday[0].day.mintemp_c
    return minTempC
}

 // console.log(`City of ${object.key.location.name}`)
    // const forecastDailyData = object.key.forecast
    // console.log(forecastDailyData.forecastday[0].day)
    // console.log(`${forecastDailyData.forecastday[0].date}`)
    // console.log(forecastDailyData.forecastday[0].day.mintemp_c)
    // console.log(forecastDailyData.forecastday[0].day.mintemp_f)
    // console.log(forecastDailyData.forecastday[0].day.maxtemp_c)
    // console.log(forecastDailyData.forecastday[0].day.maxtemp_f)
    
    // let day = `${forecastDailyData.forecastday[0].day}`
    // let forecastDate = `${forecastDailyData.forecastday[0].date}`
    // console.log(forecastDailyData.forecastday[0].day.mintemp_c)
    // console.log(forecastDailyData.forecastday[0].day.mintemp_f)
    // console.log(forecastDailyData.forecastday[0].day.maxtemp_c)
    // console.log(forecastDailyData.forecastday[0].day.maxtemp_f)
    // for (let i = 0; i < 23; i++) {
    //     console.log(`${forecastDailyData.forecastday[0].hour[i].time}`)
    //     console.log(`${forecastDailyData.forecastday[0].hour[i].temp_c}\u00B0 c`)
    //     console.log(`${forecastDailyData.forecastday[0].hour[i].temp_f}\u00B0 f`)
    // }
    // console.log(`${forecastDailyData.forecastday[0].hour[0].time}`)
    // console.log(forecastDailyData.forecastday[0])