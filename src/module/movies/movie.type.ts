export type Movie = {
    more_info: string,
    title: string,
    rating: string,
    available_hours: Array<string> | string,
    genre: string,
    duration: string,
    price: string
}

export type MovieResponse = {
    movieLists: Array<Movie>,
    schedule: string
}
