import { WeatherDataResponse } from '../types/weatherDataResponse'

function kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15
}

function mpsToKph(mps: number): number {
    return mps * 3.6
}

export function generateWeatherPhrase(data: WeatherDataResponse): string {
    const cityName = data.name
    const country = data.sys.country
    const description = data.weather[0].description
    const temp = kelvinToCelsius(data.main.temp).toFixed(2)
    const feelsLike = kelvinToCelsius(data.main.feels_like).toFixed(2)
    const visibility = (data.visibility / 1000).toFixed(0)
    const windSpeed = mpsToKph(data.wind.speed).toFixed(2)
    const humidity = data.main.humidity

    return `En la estación de ${cityName}, ${country}, el clima es "${description}" con una temperatura de ${temp}°C con sensación térmica de ${feelsLike}°C. La visibilidad es de ${visibility} km, la velocidad del viento es de ${windSpeed} km/h y la humedad es del ${humidity}%.`
}
