import { setLocationObject,
        getHomeLocation,
        getWeatherFromCoords,
        getdaynightState,
        getCoordsFromApi,
        cleanText,
        getCurrentWeatherwithcoords
    } from "./dataFunctions.js";
import {
    setPlaceholderText,
    updateDisplay,
    addSpinner,
    displayError,
    displayApiError,
    updateScreenReaderConfirmation
} from "./domFunctions.js"
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {

    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);

    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);

    const saveButton = document.getElementById("saveLocation");
    saveButton.addEventListener("click", saveLocation);

    const unitButton = document.getElementById("unit");
    unitButton.addEventListener("click", setUnitPref);

    const refreshButton = document.getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);

    const locationEntry = document.getElementById ("searchBar__form");
    locationEntry.addEventListener("submit", submitNewLocation);
    setPlaceholderText();

    loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
    if (event) {
        if (event.type === "click") {
            const mapIcon = document.querySelector(".fa-map-marker-alt");
            addSpinner(mapIcon);
        }
    }
    if (!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
    const errMsg = errObj ? errObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
};

const geoSuccess = async (position) => {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    setLocationObject(currentLoc, myCoordsObj);
   /*  console.log(currentLoc); */
    const coordsData = await getCurrentWeatherwithcoords(currentLoc);
    /* console.log("guess what");
    console.log(coordsData); */
    updateDataAndDisplay(currentLoc, coordsData);

};

const loadWeather = (event) => {
    const savedLocation = getHomeLocation();
    if (!savedLocation && !event) return getGeoWeather();
    if (!savedLocation && event.type === "click") {
        displayError(
            "No Home Location Saved.",
            "Sorry. Please save your home location first."
        );
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    } else {
        const homeIcon = document.querySelector(".fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
}

const displayHomeLocationWeather = async (home) => {
    if (typeof home === "string") {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        };
        setLocationObject(currentLoc, myCoordsObj);
        const coordsData = await getCurrentWeatherwithcoords(currentLoc);
        updateDataAndDisplay(currentLoc, coordsData);
    }
};

const saveLocation = () => {
    if (currentLoc.getLat() && currentLoc.getLon()) {
        const saveIcon = document.querySelector(".fa-save");
        addSpinner(saveIcon);
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        };
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location`);
    };
};

const setUnitPref = async () => {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    
    const coordsData = await getCurrentWeatherwithcoords(currentLoc);
    updateDataAndDisplay(currentLoc, coordsData);
}

const refreshWeather = async () => {
    const refreshIcon = document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    const coordsData = await getCurrentWeatherwithcoords(currentLoc);
    updateDataAndDisplay(currentLoc, coordsData);
};
/* 
const getCurrentWeatherwithcoords = () */

const submitNewLocation = async (event) => {
    
    event.preventDefault();
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    
    const locationIcon = document.querySelector(".fa-solid fa-magnifying-glass");
   /*  addSpinner(locationIcon); */
    
    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
    if(coordsData) {
        if (coordsData.cod === 200) {
            const myCoordsObj = {
                lat: coordsData.coord.lat,
                lon: coordsData.coord.lon,
                name: coordsData.sys.country ? `${coordsData.name}, ${coordsData.sys.country}`
                :coordsData.name
            };
            setLocationObject(currentLoc, myCoordsObj);
            updateDataAndDisplay(currentLoc, coordsData);
        } else {
            displayApiError(coordsData);
        }
    } else {
        console.log("error");
        displayError("Connection Error", "Connection Error");
    }
    
}

const updateDataAndDisplay = async (locationObj, currentWeatherConditions) => {
    const weatherJson = await getWeatherFromCoords(locationObj);
    //console.log(weatherJson);
    const timeZone = weatherJson.timezone;
    //console.log(timeZone);
    const daynightState = await getdaynightState(timeZone);
   
    if (weatherJson) updateDisplay(weatherJson, locationObj, daynightState, currentWeatherConditions);
   
};