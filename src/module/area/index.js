const axios = require("axios");
const cherio = require("cherio");
const totalReturnPerpage = 10;

const area = (page = 0, initArea) => {
  return new Promise(async (resolve, reject) => {
    try{
      const { data:html } = await axios.get('https://jadwalnonton.com/bioskop');  
      const $ = cherio.load(html);
      const locales = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a').map((index, element) => {
        return {
          locale: $(element).text(),
          url: $(element).attr('href')
        }
      }).get();
      if(initArea) {
        const findStatuslocales = locales.find(({locale}) => {          
          return locale.toLowerCase().replace(/ /g, '-') === initArea
        });
        resolve(findStatuslocales);
      }
      let slicedLocales = locales.slice(page * totalReturnPerpage, page * totalReturnPerpage + totalReturnPerpage);
      let returnedData = {
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
    catch(e) {      
      reject(e)      
    }
  })
};

// area(0, 'lubuk-linggau').then(data => console.log({data}));

module.exports = area;
