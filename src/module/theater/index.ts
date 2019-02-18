import axios from 'axios';
import cheerio from 'cheerio';

import { Theater, TheaterResponse } from './theater.type';

const theater = (url: string): Promise<TheaterResponse> => {
    return new Promise(async (resolve, reject) => {
        try{
            const { data:html } = await axios.get<string>(url);
            const $ = cheerio.load(html);
            let theaters: Array<Theater>;

            const target = $('#main > div.row.clearfix.thlist .item.theater');

            if(!target || target.length === 0){
                reject("No Data Found");
            }

            theaters = target.map((_index, element) => {
              return {
                theater_name: $(element).find('.judul').text(),
                url: $(element).find('.mojadwal').attr('href')
              }        
            }).get();            

            const nextLink = $('a[title="Selanjutnya"]').attr('href');
            const prevLink = $('a[title="Sebelumnya"]').attr('href');

            let returnedData: TheaterResponse = {
                theaters
            }
            if(nextLink) {
                returnedData.nextLink = nextLink;
            }
            if(prevLink) {
                returnedData.prevLink = prevLink;
            }
            resolve(returnedData);
        }
        catch(e){
            reject(e);
        }
    })
}

export default theater;
