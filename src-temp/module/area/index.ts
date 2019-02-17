import axios from 'axios';
import cheerio from 'cheerio';
import { Area } from './area.type';

const totalReturnPerpage = 10;

const area = (page: number = 10, initArea?: string) => {
    return new Promise( async (resolve, reject) => {
        try {
            const { data:html } = await axios.get<string>('https://jadwalnonton.com/bioskop');
            const $ = cheerio.load(html);

            let locales: Array<Area>;

            locales = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a').map((_index, element) => {
                return {
                  locale: $(element).text(),
                  url: $(element).attr('href')
                 }
            }).get();
            console.log({locales})
        }
        catch(e){

        }
    })
}

area(0).then(data => console.log({data}));

export default area;
