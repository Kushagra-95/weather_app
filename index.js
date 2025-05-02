const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.ACCUWEATHER_API_KEY;


async function getLocationKey(city) {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`;
    const response = await axios.get(url);
    if (response.data.length === 0) throw new Error("City not found");
    return response.data[0].Key;
}


async function getCurrentWeather(locationKey) {
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data[0];
}


app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).send({ error: "City is required" });

    try {
        const locationKey = await getLocationKey(city);
        const weather = await getCurrentWeather(locationKey);
        res.send({
            city,
            weatherText: weather.WeatherText,
            temperature: weather.Temperature.Metric.Value + "°C"
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Weather app running on http://localhost:${PORT}`);
});
