import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { LocationDataResponse } from "./locationDataResponse";
import { WeatherDataResponse } from "./weatherDataResponse";

const client = axios.create({
  baseURL: "https://api.openweathermap.org",
});

async function getJsonData<T>(
  endpoint: string,
  params: any
): Promise<T | null> {
  const config: AxiosRequestConfig = {
    headers: {
      Accept: "application/json",
    } as RawAxiosRequestHeaders,
    params: { ...params, appid: process.env.API_KEY || "" },
  };

  try {
    const response = await client.get<T>(endpoint, config);
    console.log(response.status);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getWeather(
  cityName: string
): Promise<WeatherDataResponse | null> {
  const locationData = await getJsonData<LocationDataResponse>(
    "/geo/1.0/direct",
    { q: cityName }
  );
  if (!locationData) {
    return null;
  }
  const firstLocation = locationData[0];
  return await getJsonData<WeatherDataResponse>("/data/2.5/weather", {
    lat: firstLocation.lat,
    lon: firstLocation.lon,
  });
}
