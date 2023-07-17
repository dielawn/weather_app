const containerDiv = document.getElementById('container')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const todayDiv = document.getElementById('todayDiv')
const forecastDiv = document.getElementById('forecastDiv')
const metricBtn = document.getElementById('metricBtn')
const standardBtn = document.getElementById('standardBtn')


let city 
const data = []
let isMetric = handleMetric()
let previousChart = null;

console.log(isMetric)

metricBtn.addEventListener('change', () => {
   isMetric = handleMetric()
    getForecastData()
    displayDate()
    displayToday()
    displayHourly()
    graphDailyTemp()
    
})

standardBtn.addEventListener('change', () => {
   isMetric = handleMetric()
    getForecastData()
    displayDate()
    displayToday()
    displayHourly()
    graphDailyTemp()
   
})


function handleMetric() {   
   if (metricBtn.checked) {
    return true
   } else {
    return false
   }
}



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
    displayToday()

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
    displayToday()
    displayHourly()
    graphDailyTemp()
    changeDivColor()
} catch (error) {
	console.error(error);
}
}

function handleDegreeSymbol() {
    let tempUnit
    if (isMetric) {
        tempUnit = 'c'
    } else {
        tempUnit = 'f'
    }
    let degreeSymbol = `\u00B0${tempUnit}`
    return degreeSymbol
}

function handleInOrMm() {
    let measureUnit 
    if (isMetric) {
        measureUnit = 'mm'
    } else {
        measureUnit = 'in'
    }
    return measureUnit
}

function handleMphOrKph() {
    let speedUnit 
    if (isMetric) {
        speedUnit = 'kph'
    } else {
        speedUnit = 'mph'
    }
    return speedUnit
}


function displayToday() {

    const today = [
        getCityName(), 
        [getCurrentTemp(), handleDegreeSymbol()],
        getCurrentText(), 
        ['Precip: ', getCurrentPrecip(), handleInOrMm()], 
        'Wind',
        `Direction: ${getWindDir()}`, 
        ['Speed: ',getWindSpeed(), handleMphOrKph()], 
        ['Gust: ',getWindGust(), handleMphOrKph()], 
        `UV: ${getUv()}`,
        `Clouds: ${getCloud()}`
    ]

    let prevElements = document.querySelectorAll('p')
    let prevIcon = document.querySelector('img')

    if(prevElements.length > 0) {
        prevElements.forEach(element => {
            element.remove()
        })
    }

    if(prevIcon) {
        prevIcon.remove()
    }
    const iconImg = document.createElement('img')
    iconImg.src = getCurrentIcon()
    iconImg.classList.add('icon')
    todayDiv.appendChild(iconImg)
    today.forEach(item => {   
    const textElement = document.createElement('p')
    if (typeof item === 'object') {
        const editedTxt = Object.values(item).map(value => {
          if (typeof value === 'string') {
            return value.replace(/,/g, ' ')
          }
          return value
        })
        textElement.textContent = editedTxt.join(' ')
      } else {
        const editedTxt = item.replace(/,/g, ' ')
        textElement.textContent = editedTxt
      }
  todayDiv.appendChild(textElement)
  
   })
  
}

function displayDate() {
    const dateElment = document.createElement('p')
    dateElment.textContent = `${hourlyForecast[0].date}`
    todayDiv.appendChild(dateElment)
}

function displayHourly() {
    getHourlyData()
    console.log(hourlyForecast)
    displayDate()
    const prevElements = document.querySelectorAll('.hourDiv')
    if (prevElements.length > 0) {
        prevElements.forEach(element => {
            element.remove()
        })
    }
    hourlyForecast.forEach(item => {
        const hourDiv = document.createElement('div')
        hourDiv.classList.add('hourDiv')
        changeDivColor()
    

        forecastDiv.classList.add('grid8Cols')
        forecastDiv.appendChild(hourDiv)
        let timeTxt = document.createElement('p')
        timeTxt.textContent = item.time
        let tempTxt = document.createElement('p')
        tempTxt.textContent = `${item.temp}${handleDegreeSymbol()}`
        hourDiv.appendChild(timeTxt)
        hourDiv.appendChild(tempTxt)

    })
}


function changeDivColor() {
  let hourDivs = document.querySelectorAll('.hourDiv')
    for (let i = 0; i < hourDivs.length; i++) {
        hourDivs[i].style.backgroundColor = getColorsByTemp(hourlyForecast[i].temp)
    }
}

function graphDailyTemp() {


   const temperatures = hourlyForecast.map(item => item.temp)
   const time = hourlyForecast.map(item => item.time)

   const canvas = document.getElementById('chartCanvas')
   const ctx = canvas.getContext('2d')

   if (previousChart) {
    previousChart.destroy()
   }

  previousChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: time,
        datasets: [{
            label: 'Todays Temperature',
            data: temperatures,
            borderColor: 'black',
            fill: false,
        }],
    }, 
    options: {
        responsive: true,
        scales: {
            y: {
                begainAtZero: false,
            },
        },
    },
   })
}


function getColorsByTemp(temperature) {
    let coldTemp
    let hotTemp
    if (isMetric) {
        coldTemp = 0;
        hotTemp = 32;
    } else {
        coldTemp = 34;
        hotTemp = 90;
    }
    const tempPercentage = (temperature - coldTemp) / (hotTemp - coldTemp)
    const hue = (1 - tempPercentage) * 240
    const color = `hsl(${hue}, 100%, 50%)`
    console.log(color)
    return color
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

