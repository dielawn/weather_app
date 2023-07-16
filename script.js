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
   return getWeatherData()
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
    
   
   
}

handleCityValue()
getWeatherData()

