export type Theater = {
    theater_name: string,
    url: string
}

export type TheaterResponse = {
    theaters: Array<Theater>,
    nextLink?: string,
    prevLink?: string
}
