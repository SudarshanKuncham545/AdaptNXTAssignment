const express = require('express');
const axios = require('axios');
const app = express();

// Replace 'YOUR_API_KEY' with your actual Weatherstack API key
const API_KEY = '1a2b3c4d5e6f7g8h9i0j';
const BASE_URL = 'http://api.weatherstack.com/current';

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <form action="/weather" method="get">
            <label for="city">Enter city name:</label>
            <input type="text" id="city" name="city">
            <button type="submit">Get Weather</button>
        </form>
    `);
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.send('Please enter a city name.');
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                access_key: API_KEY,
                query: city
            }
        });

        if (response.data.error) {
            return res.send(`Error: ${response.data.error.info}`);
        }

        const weatherData = response.data.current;
        res.send(`
            <h1>Weather in ${city}</h1>
            <p>Temperature: ${weatherData.temperature}°C</p>
            <p>Weather Descriptions: ${weatherData.weather_descriptions.join(', ')}</p>
            <p>Humidity: ${weatherData.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind_speed} km/h</p>
            <a href="/">Back</a>
        `);
    } catch (error) {
        res.send('An error occurred while fetching weather data.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
