(function() {
    function capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function fetchWeather(lat, lon, ajaxUrl) {
        const response = await fetch(`${ajaxUrl}?action=get_weather&lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données météo depuis le serveur');
        const weatherJson = await response.json();
        if (!weatherJson.success) throw new Error(weatherJson.data);
        return weatherJson.data;
    }

    async function getWeatherGreeting() {
        const weatherEl = document.getElementById('weather-greeting');
        if (!weatherEl) return;

        const CACHE_KEY = 'weatherData';
        const CACHE_EXPIRY_MINUTES = 30;

        const iconMap = {
            '01d': { icon: 'wi-day-sunny', color: '#fff', bg: 'linear-gradient(45deg, #FDB813, #FF9800)' },
            '01n': { icon: 'wi-night-clear', color: '#fff', bg: 'linear-gradient(45deg, #2C3E50, #4CA1AF)' },
            '02d': { icon: 'wi-day-cloudy', color: '#333', bg: 'linear-gradient(45deg, #90CAF9, #E3F2FD)' },
            '02n': { icon: 'wi-night-alt-cloudy', color: '#eee', bg: 'linear-gradient(45deg, #455A64, #90A4AE)' },
            '03d': { icon: 'wi-cloud', color: '#333', bg: 'linear-gradient(45deg, #B0BEC5, #ECEFF1)' },
            '03n': { icon: 'wi-cloud', color: '#fff', bg: 'linear-gradient(45deg, #78909C, #CFD8DC)' },
            '04d': { icon: 'wi-cloudy', color: '#fff', bg: 'linear-gradient(45deg, #757575, #BDBDBD)' },
            '04n': { icon: 'wi-cloudy', color: '#fff', bg: 'linear-gradient(45deg, #37474F, #78909C)' },
            '09d': { icon: 'wi-showers', color: '#fff', bg: 'linear-gradient(45deg, #2196F3, #BBDEFB)' },
            '09n': { icon: 'wi-showers', color: '#fff', bg: 'linear-gradient(45deg, #1565C0, #64B5F6)' },
            '10d': { icon: 'wi-day-rain', color: '#fff', bg: 'linear-gradient(45deg, #1E88E5, #B3E5FC)' },
            '10n': { icon: 'wi-night-alt-rain', color: '#fff', bg: 'linear-gradient(45deg, #0D47A1, #81D4FA)' },
            '11d': { icon: 'wi-thunderstorm', color: '#fff', bg: 'linear-gradient(45deg, #B71C1C, #EF5350)' },
            '11n': { icon: 'wi-thunderstorm', color: '#fff', bg: 'linear-gradient(45deg, #880E4F, #F06292)' },
            '13d': { icon: 'wi-snow', color: '#333', bg: 'linear-gradient(45deg, #E0F7FA, #B3E5FC)' },
            '13n': { icon: 'wi-snow', color: '#222', bg: 'linear-gradient(45deg, #B0BEC5, #E3F2FD)' },
            '50d': { icon: 'wi-fog', color: '#333', bg: 'linear-gradient(45deg, #CFD8DC, #ECEFF1)' },
            '50n': { icon: 'wi-fog', color: '#333', bg: 'linear-gradient(45deg, #B0BEC5, #ECEFF1)' },
        };

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const cachedData = JSON.parse(cached);
                const now = Date.now();
                if (now - cachedData.timestamp < CACHE_EXPIRY_MINUTES * 60 * 1000) {
                    displayWeather(cachedData.weatherData);
                    return;
                }
            }

            const locationRes = await fetch('https://ipapi.co/json/');
            if (!locationRes.ok) throw new Error('Erreur lors de la récupération des données de localisation');
            const locationData = await locationRes.json();

            const lat = locationData.latitude;
            const lon = locationData.longitude;

            const weatherData = await fetchWeather(lat, lon, weatherGreeting.ajaxUrl);

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                weatherData: weatherData
            }));

            displayWeather(weatherData);

        } catch (error) {
            weatherEl.innerText = `Erreur lors de la récupération de la météo: ${error.message}`;
            weatherEl.style.background = 'linear-gradient(45deg, #616161, #9e9e9e)';
        }

        function displayWeather(weatherData) {
            const city = weatherData.name;
            const temp = Math.round(weatherData.main.temp);
            const desc = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;

            const iconInfo = iconMap[iconCode] || { icon: 'wi-na', color: '#999', bg: 'linear-gradient(45deg, #ccc, #eee)' };
            const descCapitalized = capitalizeFirstLetter(desc);

            weatherEl.innerHTML = `
                ${city}
                <i class="wi ${iconInfo.icon}" title="${descCapitalized}" style="font-size: 25px; margin: 0 5px; vertical-align: middle; color: ${iconInfo.color};"></i>
                ${temp}°C
            `;
            weatherEl.style.background = iconInfo.bg;
        }
    }

    document.addEventListener('DOMContentLoaded', getWeatherGreeting);
})();
