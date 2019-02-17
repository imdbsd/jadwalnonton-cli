type Area = { 
    locale: string,
    url: string
}

type AreaResponse = {
    locales: Area,
    prevPage?: number,
    nextPage?: number
}

export {
    Area, AreaResponse
}
