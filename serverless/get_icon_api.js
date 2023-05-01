const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body);
        const { firstTwochars, lastchar } = params;
        const url = `https://openweathermap.org/img/wn/${firstTwochars}${lastchar}@2x.png`;
        console.log(url)
    
        try {
            const iconApi = await fetch(url);
            const iconApiJson = await iconApi.json();
        return {
                statusCode: 200,
                body: JSON.stringify(iconApiJson)
            };
        } catch (error) {
            console.error(error);
            return {
              statusCode: 500,
              body: JSON.stringify({ message: 'Internal Server Error' }),
            };
          }
};