export const setPlaceholderText = () => {
    const input = document.getElementById("searchBar__text");
    window.innerWidth < 400 ? (input.placeholder = "City, State, Country") : (input.placeholder = "City, State, Country, or ZipCode");
}


export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");
}

export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg);
}

export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
    updateScreenReaderConfirmation(`${properMsg}, Please try again.`);

}

const toProperCase = (text) => {
    const words = text.split(" ");
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
}

const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById("currentForecast__location");
    if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
        const msgArray = message.split(" ");
        const mapArray = msgArray.map(msg => {
            return msg.replace(":", ": ");
        })
        const lat = mapArray[0].indexOf("-") === -1 ? mapArray[0].slice(0,10) : mapArray[0].slice(0, 11);
        
        const lon = mapArray[1].indexOf("-") === -1 ? mapArray[1].slice(0,11) : mapArray[1].slice(0, 12);
        h1.textContent = `${lat} • ${lon}`;
    } else {
        h1.textContent = message;
    }
    
}

export const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
}

export const updateDisplay = async (weatherJson, locationObj, daynightState, currentWeatherConditions) => {
    clearDisplay();
    fadeDisplay();

    const weatherClass = getWeatherClass(/* weatherJson.daily.weathercode[0] */currentWeatherConditions.weather[0].icon, daynightState);
    console.log(weatherClass)
    setBGImage(weatherClass);
    /* const screeReaderWeather = buildScreenReaderWeather(weatherJson,locationObj);
 */
    updateWeatherLocationHeader(locationObj.getName());
    

    const ccArray = await createCurrentConditionsDivs(weatherJson, currentWeatherConditions, locationObj.getUnit(), weatherClass);
   
    displayCurrentConditions(ccArray);

    displaySixDayForecast(weatherJson);

    //setFocusOnSearch();
    fadeDisplay();
}

const fadeDisplay = () => {
    
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toggle("fade-in");
    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle("zero-vis");
    sixDay.classList.toggle("fade-in");
}

const clearDisplay = () => {
    const currentConditions = document.getElementById("currentForecast__conditions");
    deleteContents(currentConditions);
    const sixDayForecast = document.getElementById("dailyForecast__contents");
    deleteContents(sixDayForecast);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    };
;}

const getWeatherClass = (icon, daynight) => {
    
    /* let dayNight = daynight === true ? "clouds" : "night"; */
    let firstTwoChars = icon.slice(0, 2);
    //console.log(firstTwoChars)
    const lastChar = icon.slice(2);
    //console.log(lastChar)
    const weatherLookup = {
        "01": "sunny",
        "02": "clouds",
        "03": "clouds",
        "04": "fog",
        "09": "rain",
        "10": "rain",
        "11": "rain",
        "13": "snow",
        "50": "fog"
    };
    let weatherClass;
    if(lastChar === "n") {
        weatherClass = "night";
    } else if (weatherLookup[firstTwoChars]) {
        weatherClass = weatherLookup[firstTwoChars];
    } else {weatherClass = "snow"};
    /* let weatherLookup = icon === "0, 1, 2, 3" ? "clouiyds" :  45, 48  ? "fog" : icon === "51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95" ? "rain" : icon === "71, 73, 75, 77, 85, 86, 96, 99" ? "snow" : "clouds"; */
   /*  if (icon === 0 || icon === 1 || icon === 2 || icon === 3) {
        weatherLookup = "clouds";
    } else if (icon === 45 || icon === 48) {
        weatherLookup = "fog";
    }
    else if (icon >= 51 && icon <= 67 || icon === 81 || icon === 82 || icon === 95) {
        weatherLookup = "rain"
    }
    else {
        weatherLookup = "snow";
    }

    let weatherClass;
    if (dayNight === "night") {
        weatherClass = "night";
    } else { 
        weatherClass = weatherLookup;
     } */
    /*  console.log(weatherClass); */
     return weatherClass;
     
};

const setBGImage = (weatherClass) => {
    document.documentElement.classList.add(weatherClass);
    document.documentElement.classList.forEach(img => {
        if (img !== weatherClass) document.documentElement.classList.remove(img);
    });
};

/* const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempUnit = unit === "fahrenheit" ? "fahrenheit" : "Celsius";
    return `${weatherJson.current.weather[0].desc}`
} */

const setFocusOnSearch = () => {
    /* document.getElementById("searchBar__text").focus(); */
    document.getElementById("searchBar__text").textContent("");

}

const createCurrentConditionsDivs = async (weatherObj, currentWeatherConditions, unit, weatherClass) => {
   
    const tempUnit = unit === "fahrenheit" ? "F" : "C";
    const windUnit = unit === "fahrenheit" ? "mph" : "m/s";
   
    const icon = await createMainImgDiv(currentWeatherConditions.weather[0].icon, currentWeatherConditions.weather[0].description);
    const temp = createElem("div", "temp", `${Math.round(Number(currentWeatherConditions.main.temp))}º`, `${tempUnit}`);

    const properDesc = toProperCase(currentWeatherConditions.weather[0].description);
    const desc = createElem("div", "desc", properDesc);
    
    const feels = createElem("div", "feels", `Feels Like ${currentWeatherConditions.main.feels_like}º`);
    const maxTemp = createElem("div", "maxtemp", `High ${Math.round(Number(currentWeatherConditions.main.temp_max))}º`);
    const minTemp = createElem("div", "mintemp", `Low ${Math.round(Number(currentWeatherConditions.main.temp_min))}º`);
    const humidity = createElem("div", "humidity", `Humidity ${currentWeatherConditions.main.humidity}%`);
    const wind = createElem("div", "wind", `Wind ${Math.round(Number(currentWeatherConditions.wind.speed))}`, `${windUnit}`);
    
    return [icon, temp, desc, feels, humidity, wind ,maxTemp, minTemp ];

}

const createMainImgDiv = async (icon, altText) => {
    const iconDiv = createElem("div", "icon");
    iconDiv.id = "icon";
    /* const apiIcon = createElem("img") */
    const faIcon = await translateIconToFontAwesome(icon);
   /*  apiIcon. */
    faIcon.ariaHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    
    return iconDiv;
}

const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.className = divClassName;
    if (divText) {
        div.textContent = divText;
    }
    if (divClassName === "temp") {
        const unitDiv = document.createElement("div");
        unitDiv.classList.add("unit");
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
};

const translateIconToFontAwesome = async (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const apiicon = await getIconFromApi(firstTwoChars, lastChar);
    /* console.log(apiicon);
    console.log("above"); */
    return apiicon;
    /* switch (firstTwoChars) {
        case "01":
            if (lastChar === "d") {
                i.classList.add("far", "fa-sun");
            } else {
                i.classList.add("far", "fa-moon");
            }
            break;
        case "02":
            if (lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun");
            } else {
                i.classList.add("fas", "fa-cloud-moon");
            }
            break;
        case "03":
            i.classList.add("fas", "fa-cloud");
            break;
        case "04":
            i.classList.add("fas", "fa-cloud-meatball");
            break;
        case "09":
            i.classList.add("fas", "fa-cloud-rain");
            break;
        case "10":
            if (lastChar === "d") {
                    i.classList.add("fas", "fa-cloud-sun-rain");
                } else {
                    i.classList.add("fas", "fa-cloud-moon-rain");
                }
                break;
        case "11":
                i.classList.add("fas", "fa-poo-storm");
                break;
        case "13":
                i.classList.add("fas", "fa-snowflake");
                break;
        case "50":
                i.classList.add("fas", "fa-smog");
                break;
        default:
            i.classList.add("far", "fa-question-circle")
    }
    return i;
    */
}
 
const getIconFromApi = async (firstTwoChars, lastChar) => {
    const urlDataObj = {
        firstTwochars: firstTwoChars,
        lastchar: lastChar
    }
    console.log(firstTwoChars + lastChar)
    try {
        const iconApi = await fetch("/.netlify/functions/get_icon_api", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const iconBlob = await iconApi.blob();
        const imageURL = URL.createObjectURL(iconBlob);
        const img = new Image();
        img.src = imageURL;
        /* console.log(img)
        console.log(img.src) */
    
        return img;
       /*  const iconApiJson = await iconApi.json();
        console.log(iconApi);
        return iconApiJson; */
    } catch (err) {
        console.error(err);
    }
}

const displayCurrentConditions = (currentConditionsArray) => {
    
    const ccContainer = document.getElementById("currentForecast__conditions");
    currentConditionsArray.forEach((cc) => {
        ccContainer.appendChild(cc);
        //console.log(cc);
    });

}

const displaySixDayForecast = (weatherJson) => {
    
    for (let i = 1; i <= 6; i++) {
        const dfArray = createDailyForecastDivs(weatherJson.daily.time[i], weatherJson);//, weatherJson.daily.temperature_2m_max[i], weatherJson.daily.temperature_2m_min[i]
        /* console.log(dfArray);
        console.log("dom functions"); */
        
        displayDailyForecast(dfArray);        
    }
    resetTrackers();
}

const createDailyForecastDivs = (dailyweatherJsontime, dailyweatherJson) => {
    
    const dayAbbreviatonText = dailyweatherJsontime.slice(8, ) + "/" + dailyweatherJsontime.slice(5, 7)/* getDayAbbreviaton(dailyweatherJson.time) */;
    /* console.log(dayAbbreviatonText); */
    const dayAbbreviaton = createElem("p", "dayAbbreviaton", dayAbbreviatonText);
    

    const dayHigh = createElem("p", "dayHigh", `${getHigh(dailyweatherJson)}º`);
    const getdayIcon = getdayCode(dailyweatherJson);
    //console.log(dailyweatherJson)
    
   /*  const dayIcon = createElem("p", "weathericon", `${getdayIcon}`) */
    const iconDiv = createElem("div", "icon");
    
   
    iconDiv.appendChild(getdayIcon);
    
    const dayLow = createElem("p", "dayHigh", `${getLow(dailyweatherJson)}º`);
    
    return [dayAbbreviaton, iconDiv, dayHigh, dayLow];
}
let numtrack2 = 1;
const getHigh = (dailyweatherJson) => {
    for (let i = 1; i <= 6;) {
        i = numtrack2;
        const dayHigh = Math.round(Number(dailyweatherJson.daily.temperature_2m_max[i]));
        numtrack2++;
        return dayHigh;
    }
}
let numtrack1 = 1;
const getLow = (dailyweatherJson) => {
    for (let i = 1; i <= 6;) {
        i = numtrack1;
        const dayLow = Math.round(Number(dailyweatherJson.daily.temperature_2m_min[i]));
        numtrack1++;
        return dayLow;
    }
}
let numtrack = 1;
const getdayCode = (dailyweatherJson) => {
    //const Icons = [];
    
    for (let i = 1; i <= 6;) {
        //console.log(numtrack)
        i = numtrack;
    const codeArray = dailyweatherJson.daily.weathercode[i];
    numtrack++;
    const Icon = createDailyForecastIcon(codeArray);
   
    return Icon;
}

} 

const resetTrackers = () => {
    const num1 = 1;
    numtrack = num1;
    numtrack1 = num1;
    numtrack2 = num1;
    //console.log("RESETED")
}

const getDayAbbreviaton = (data) => {
    const dateObj = new Date(data * 1000);
    const utcString = dateObj.toUTCString();
    return utcString.slice(0, 3).toUpperCase
}

const createDailyForecastIcon = (icon) => {
    /* const img = document.createElement("img"); */
    /* console.log(icon);
    icon = 45; */
    let weatherIcon;
    if (icon === 0 ) {
        weatherIcon = "sunny"
    } else if (icon === 1 || icon === 2) {
        weatherIcon = "sun/clouds"
    } 
    else if (icon === 3) {
        weatherIcon = "clouds";
    } else if (icon === 45 || icon === 48) {
        weatherIcon = "fog";
    }
    else if (icon >= 51 && icon <= 67 || icon === 80 || icon === 81 || icon === 82 || icon === 95) {
        weatherIcon = "rain"
    }
    else {
        weatherIcon = "snow";
    }
    //console.log(weatherIcon);

    const i = document.createElement("i");

        switch (weatherIcon) {
            case "sunny":
                    i.classList.add(/* "far",  */"fa-solid", "fa-sun");
                break;
            case "sun/clouds":
                    i.classList.add("fa-solid", "fa-cloud-sun");
                break;
            case "clouds":
                    i.classList.add(/* "far",  */"fa-solid", "fa-cloud");
                break;
            case "fog":
                i.classList.add("fa-solid", "fa-smog");
                break;
            case "rain":
                i.classList.add("fa-solid", "fa-cloud-rain");
                break;
            case "snow":
                i.classList.add("fa-solid", "fa-snowflake");
                break;
            default:
                i.classList.add("fa-solid", "fa-sun-cloud")
        }
        return i;
}

const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem("div", "forecastDay");
    dfArray.forEach(el => {
        dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById("dailyForecast__contents");
    dailyForecastContainer.appendChild(dayDiv);
}