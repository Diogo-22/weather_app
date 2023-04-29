const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body);
    const { lat, lon, units } = params;
    const unitts = units === "celsius" ? "metric" : "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${unitts}`;

    try {
        const currentWeatherwithcoords = await fetch(url);
        const currentweatherJson = await currentWeatherwithcoords.json();
     return {
            statusCode: 200,
            body: JSON.stringify(currentweatherJson)
        };
    } catch (err) {
            return { statusCode: 422, body: err.stack };
        }
}