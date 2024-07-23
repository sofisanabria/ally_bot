import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    RawAxiosRequestHeaders,
} from 'axios'
import { LocationResponse } from '../types/LocationResponse'
import { WeatherResponse, WeatherShortResponse } from '../types/WeatherResponse'

class ApiException extends Error {
    constructor(message: string, public readonly status?: number) {
        super(message)
        this.name = 'ApiException'
    }
}

class WeatherApiClient {
    private client: AxiosInstance

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL: baseURL,
        })
    }

    private async getJsonData<T>(endpoint: string, params: any): Promise<T> {
        const config: AxiosRequestConfig = {
            headers: {
                Accept: 'application/json',
            } as RawAxiosRequestHeaders,
            params: { ...params, appid: process.env.WEATHER_KEY || '' },
        }

        try {
            const response = await this.client.get<T>(endpoint, config)
            console.log(response.status)
            console.log(response.data)
            return response.data
        } catch (err: any) {
            console.error(err)
            if (err.response) {
                throw new ApiException(
                    `API request failed with status ${err.response.status}`,
                    err.response.status
                )
            } else {
                throw new ApiException(`API request failed: ${err.message}`)
            }
        }
    }

    public async getWeather(cityName: string): Promise<WeatherShortResponse> {
        const locationData = await this.getJsonData<LocationResponse>(
            '/geo/1.0/direct',
            { q: cityName }
        )
        if (!locationData || locationData.length === 0) {
            throw new ApiException('Location not found')
        }
        const firstLocation = locationData[0]
        const { weather, main, visibility, wind, timezone, name } =
            await this.getJsonData<WeatherResponse>('/data/2.5/weather', {
                lat: firstLocation.lat,
                lon: firstLocation.lon,
                lang: 'es',
                units: 'metric',
            })
        return { weather, main, visibility, wind, timezone, name }
    }
}

const weatherApiClient = new WeatherApiClient('https://api.openweathermap.org')

export { weatherApiClient, ApiException }
