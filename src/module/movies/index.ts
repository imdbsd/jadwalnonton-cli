import axios from 'axios';
import cheerio from 'cheerio';

import { Movie, MovieResponse } from './movie.type';

const movies = (url: string): Promise<MovieResponse> => {
    return new Promise(async (resolve, reject) => {
        try{
            const { data:html } = await axios.get<string>(url);
            const $ = cheerio.load(html);

            const target = $('#main > div.mtom20 .item');
            if(!target || target.length === 0){
                reject("No Data found");
            }

            const movieLists: Array<Movie> = target.map((_index, element) => {
                let [genre, duration] = $(element).find('.sched_desc > p:nth-child(2)').text().split(' - ');
                let available_hours: Array<string> = $(element).find('.usch > li.active').map((_index, hour) => {
                    return $(hour).text();
                }).get()
                let movie = {
                    more_info: $(element).find('h2 > a').attr('href'),
                    title: $(element).find('h2 > a').text(),
                    rating: $(element).find('.rating').text() === '' ? 'unrated' : $(element).find('.rating').text(),
                    available_hours,
                    genre,
                    duration,
                    price: $(element).find('.htm').text().replace('Harga tiket masuk ', ''),
                }
                return movie;        
            }).get();

            resolve({
                movieLists,
                schedule: $('.theafilter span.right').text()
            });
        }
        catch(e){
            reject(e);
        }
    })
}

export default movies;
