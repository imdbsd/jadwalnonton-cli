const axios = require("axios");
const cherio = require("cherio");

const theater = url => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data:html } = await axios.get(url);
      const $ = cherio.load(html);
      const theaters = $('#main > div.row.clearfix.thlist .item.theater').map((index, element) => {
        return {
          theater_name: $(element).find('.judul').text(),
          url: $(element).find('.mojadwal').attr('href')
        }        
      }).get();
      const nextLink = $('a[title="Selanjutnya"]').attr('href');
      const prevLink = $('a[title="Sebelumnya"]').attr('href');
      let returnedData = {
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
    catch(e) {
      reject(e);
    }
  })
}

// theater('https://jadwalnonton.com/bioskop/di-surabaya/?city=55&page=2').then(data => console.log({data}))

module.exports = theater;
