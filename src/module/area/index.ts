import axios from 'axios';
import cheerio from 'cheerio';
import { Area, AreaResponse } from './area.type';

const totalReturnPerpage = 10;

const area = (page: number = 0): Promise<AreaResponse | undefined> => {
    return new Promise( async (resolve, reject) => {
        try {
            const { data:html } = await axios.get<string>('https://jadwalnonton.com/bioskop');
            const $ = cheerio.load(html);

            let locales: Array<Area>;

            const target = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a');

            if(!target || target.length === 0){
                return reject("data not found");
            }

            locales = target.map((_index, element) => {
                return {
                  locale: $(element).text(),
                  url: $(element).attr('href')
                 }
            }).get();
            
            let slicedLocales = locales.slice(page * totalReturnPerpage, page * totalReturnPerpage + totalReturnPerpage);
            let returnedData: AreaResponse= {
                locales: slicedLocales
            }      
            if(page > 0) {        
                returnedData.prevPage = page - 1;
            }
            if(locales.slice((page + 1) * totalReturnPerpage, (page + 1) * totalReturnPerpage + totalReturnPerpage).length !== 0) {
                returnedData.nextPage = page + 1;
            }
            
            resolve(returnedData);
        }
        catch(e){
            reject(e);
        }
    })
}

const findArea = (initArea: string): Promise<Area | undefined> => {
    return new Promise( async (resolve, reject) => {
        try {
            const { data:html } = await axios.get<string>('https://jadwalnonton.com/bioskop');
            const $ = cheerio.load(html);

            let locales: Array<Area>;

            const target = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a');

            if(!target || target.length === 0){
                reject("no data found");
            }

            locales = target.map((_index, element) => {
                return {
                  locale: $(element).text(),
                  url: $(element).attr('href')
                 }
            }).get();

            const findStatuslocales = locales.find(({locale}) => {          
                return locale.toLowerCase().replace(/ /g, '-') === initArea
            });

            resolve(findStatuslocales);
        }
        catch(e) {
            reject(e);
        }
    })
}

export {
    area,
    findArea
};
