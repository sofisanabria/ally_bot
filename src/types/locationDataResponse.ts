export type LocationDataResponse = locationResponseItem[]

export interface locationResponseItem {
  name: string
  local_names?: unknown
  lat: number
  lon: number
  country: string
  state: string
}