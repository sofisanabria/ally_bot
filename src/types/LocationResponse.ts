export type LocationResponse = Location[]

interface Location {
    name: string
    local_names?: unknown
    lat: number
    lon: number
    country: string
    state: string
}
