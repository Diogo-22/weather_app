const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body);
    const { lat, lon, units } = params;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&daily=temperature_2m_max&daily=temperature_2m_min&timezone=auto&forecast_days=7&hourly=is_day`
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return {
            statusCode: 200,
            body: JSON.stringify(weatherJson)
        };
    } catch (err) {
        return { statusCode: 422, body: err.stack };
    }
}