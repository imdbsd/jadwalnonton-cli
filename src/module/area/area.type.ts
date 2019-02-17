export type Area = { 
    locale: string,
    url: string
}

export type AreaResponse = {
    locales: Array<Area>,
    prevPage?: number,
    nextPage?: number
}
