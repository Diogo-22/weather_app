//const WEATHER_API_KEY = `cf4cdabdf178f644d4cf75faba1a3691`;
export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.setUnit(unit);
    }
};

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
};



export const getWeatherFromCoords = async (locationObj) => {
    /* const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    //const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&daily=temperature_2m_max&daily=temperature_2m_min&timezone=auto&forecast_days=7&hourly=is_day`;
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        // const timeZone = weatherJson.timezone;
        return weatherJson;
    } catch (err) {
        console.error(err);
    } */
    const urlDataObj = {
         lat: locationObj.getLat(),
         lon: locationObj.getLon(),
         units: locationObj.getUnit()
    };
    try {
        const weatherStream = await fetch("/.netlify/functions/get_weather", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const weatherJson = await weatherStream.json();
        console.log(weatherJson);
        return weatherJson;
    } catch (err) {
        console.error(err);
    }
};

export const getdaynightState = async (timeZone) => {
    /* const urlvariable = timeZone;
    const url = `http://worldtimeapi.org/api/timezone/${urlvariable}`;
    try {
        const daynightApi = await fetch(url);
        const daynightJson = await daynightApi.json();
        
        const daynightState = daynightJson.dst;
        
        
        return daynightState;
    } catch (err) {
        console.error(err);
    } */

    //serverless
    const urlDataObj = {
        timeZone: timeZone
    }
    try {
        const daynightApi = await fetch(`/.netlify/functions/get_day_night`, {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const daynightJson = await daynightApi.json();
        return daynightJson;
    } catch (err) {
        console.error(err);
    }

};

export const getCurrentWeatherwithcoords = async (locationObj) => {
    /* const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    const unitts = units === "celsius" ? "metric" : "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${unitts}`;
    try {
        const currentWeatherwithcoords = await fetch(url);
        const currentweatherJson = await currentWeatherwithcoords.json();
        return currentweatherJson;
    } catch (err) {
        console.error(err);
    } */

    //serverless

    const urlDataObj = {
        lat: locationObj.getLat(),
        lon: locationObj.getLon(),
        units: locationObj.getUnit()
   };
   console.log("runnin");
   try {
    const currentWeatherwithcoords = await fetch("/.netlify/functions/get_cc_withcoords", {
        method: "POST",
        body: JSON.stringify(urlDataObj)
    });
    
    const jsonCurrentWithCoords = await currentWeatherwithcoords.json();
    return jsonCurrentWithCoords;
    } catch (err) {
        console.error(err);
    }
}

export const getCoordsFromApi = async (entryText, units) => {
    /* const regex = /^\d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const unitts = units === "celsius" ? "metric" : "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?&${flag}=${entryText}&units=${unitts}&appid=${WEATHER_API_KEY}`;

    const encodedUrl = encodeURI(url);
    try {
        
        const dataStream = await fetch(encodedUrl);
        
        // units = units === "metric" ? "celsius" : "fahrenheit";
        const jsonData = await dataStream.json();
        return jsonData;
    }   catch (err) {
        console.error(err.stack);
    } */

    const urlDataObj = {
        text: entryText,
        units: units
    }
    try {
        const dataStream = await fetch(`/.netlify/functions/get_coords`, {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const jsonData = await dataStream.json();
        console.log(jsonData)
        return jsonData;
    } catch (err) {
        console.error(err);
    }
}

export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
}