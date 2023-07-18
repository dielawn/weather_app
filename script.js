const containerDiv = document.getElementById('container')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const todayDiv = document.getElementById('todayDiv')
const forecastDiv = document.getElementById('forecastDiv')
const metricBtn = document.getElementById('metricBtn')
const standardBtn = document.getElementById('standardBtn')
const gifDiv = document.getElementById('gifDiv')
const scaleDiv = document.getElementById('scaleDiv')


let city 
const data = []
const gifData = []
let isMetric = handleMetric()
let previousChart = null;

let imageSrc
let searchFor;

//weather data
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
    searchFor = getCurrentText()
    loadNewImage()
    createTempScale()
} catch (error) {
	console.error(error);
}
}

//gif stuff
const loadNewImage = () => {
    const gifImage = document.getElementById('gifImage')
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=OgByqKc6eOHLhIPmaUX8eaWUTPstl8DL&s=${searchFor}`, {
    mode: 'cors'
  })
.then((res) => {
    res.json().then((data) => {
        console.log(data.data.images.original.url)
        imageSrc = data.data.images.original.url
        createImageEl(imageSrc)
    })
})
.catch((err) => {
    console.log('no this did not work')
})
}

function createImageEl(source) {
    let prevGif = document.getElementById('newGif')
    if (prevGif) {
        prevGif.remove()
    }
    const newGif = document.createElement('img')
    newGif.classList.add('newGif')
    newGif.id = 'newGif'
    newGif.src = source
    gifDiv.appendChild(newGif)
}


metricBtn.addEventListener('change', () => {
   isMetric = handleMetric()
    getForecastData()
    displayDate()
    displayToday()
    displayHourly()
    createTempScale()
    graphDailyTemp()

    
})

standardBtn.addEventListener('change', () => {
   isMetric = handleMetric()
    getForecastData()
    displayDate()
    displayToday()
    displayHourly()
    createTempScale()
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
    createTempScale()
    graphDailyTemp()

})


handleCityValue()
// getCurrentData()




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
    let prevIcon = document.getElementById('iconImg')

    if(prevElements.length > 0) {
        prevElements.forEach(element => {
            element.remove()
        })
    }

    if(prevIcon) {
        prevIcon.remove()
    }
    const iconImg = document.createElement('img')
    iconImg.id = 'iconImg'
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

function getCurrentHour() {
    const currentDate = new Date();
    const hour = currentDate.getHours()
    return hour

}

function checkIsDay() {
    console.log(hourlyForecast)
   for (const hr of hourlyForecast) {
    
    let hourString = hr.time.slice(0, 2)
    hourString = Number(hourString)
    let curentHour = getCurrentHour()
    if (hourString === curentHour) {
        if (hr.isday) {
            containerDiv.classList.add('dayTime')
            containerDiv.classList.remove('nightTime')
        } else {
            containerDiv.classList.add('nightTime')
            containerDiv.classList.remove('dayTime')
        }   
    }
   }
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
const date = hourlyForecast[0].date
   const canvas = document.getElementById('chartCanvas')
   const ctx = canvas.getContext('2d')
console.log(date)
   if (previousChart) {
    previousChart.destroy()
   }

  previousChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: time,
        datasets: [{
            label: `Todays Temperature ${date}`,
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
        hotTemp = 35;
    } else {
        coldTemp = 32;
        hotTemp = 100;
    }
    const tempPercentage = (temperature - coldTemp) / (hotTemp - coldTemp)
    const hue = (1 - tempPercentage) * 240
    const color = `hsl(${hue}, 100%, 50%)`
    // console.log(color)
    return color
}

function createTempScale() {
   let prevTempScale = document.getElementById('tempScale')
   if (prevTempScale) {
    prevTempScale.remove()
   }
  const tempScale = document.createElement('div')
  tempScale.classList.add('tempScale')
  tempScale.id = 'tempScale'
  let coldTempTxt
  let medTempTxt
  let hotTempTxt
  let coldTemp
  let medTemp
  let hotTemp
  if (isMetric) {
      coldTempTxt = `0${handleDegreeSymbol()}`;
      medTempTxt = `17${handleDegreeSymbol()}`
      hotTempTxt = `35${handleDegreeSymbol()}`;
      coldTemp = getColorsByTemp(0)
      medTemp = getColorsByTemp(17)
      hotTemp = getColorsByTemp(35)
  } else {
      coldTempTxt = `32${handleDegreeSymbol()}`;
      medTempTxt = `75${handleDegreeSymbol()}`
      hotTempTxt = `100${handleDegreeSymbol()}`;
      coldTemp = getColorsByTemp(32)
      medTemp = getColorsByTemp(75)
      hotTemp = getColorsByTemp(100)
  }
  
  tempScale.style.background = `linear-gradient(to right, ${coldTemp} 0%, ${medTemp} 50%, ${hotTemp} 100%)`
  scaleDiv.appendChild(tempScale)
   //add text to scale
  const coldTxtEl = document.createElement('p')
  coldTxtEl.textContent = coldTempTxt
   const medTxtEl = document.createElement('p')
   medTxtEl.textContent = medTempTxt
   const hotTxtEl = document.createElement('p')
   hotTxtEl.textContent = hotTempTxt
   tempScale.appendChild(coldTxtEl)
   tempScale.appendChild(medTxtEl)
   tempScale.appendChild(hotTxtEl)
  
  
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
    checkIsDay()
    getCurrentHour()
    return hourlyForecast
}

