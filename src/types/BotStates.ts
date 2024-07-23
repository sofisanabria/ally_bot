interface SessionData {
    state: State
    city: string | null
    interactions: number
}

enum State {
    IDLE = 'IDLE',
    WAITING = 'WAITING',
}

export { SessionData, State }
