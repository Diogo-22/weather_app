/* const fetch = require("node-fetch"); */
import fetch from 'node-fetch'
const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body);
    const { timeZone } = params;
    
    const urlvariable = timeZone;
        const url = `http://worldtimeapi.org/api/timezone/${urlvariable}`;
        try {
            const daynightApi = await fetch(url);
            const daynightJson = await daynightApi.json();
            
            const daynightState = daynightJson.dst;
            
            
            return {
                statusCode: 200,
                body: JSON.stringify(daynightState)
            };
        } catch (err) {
                return { statusCode: 422, body: err.stack };
            }
 }