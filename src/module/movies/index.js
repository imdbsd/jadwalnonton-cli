const axios = require("axios");
const cherio = require("cherio");

const movies = url => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data:html } = await axios.get(url);
      const $ = cherio.load(html);
      const movieLists = $('#main > div.mtom20 .item').map((index, element) => {
        let [genre, duration] = $(element).find('.sched_desc > p:nth-child(2)').text().split(' - ');
        let movie = {
          more_info: $(element).find('h2 > a').attr('href'),
          title: $(element).find('h2 > a').text(),
          rating: $(element).find('.rating').text() === '' ? undefined : $(element).find('.rating').text(),
          genre,
          duration,
          price: $(element).find('.htm').text().replace('Harga tiket masuk ', ''),
        }              
        // console.log({
        //   movie
        // })   
      }).get();
      resolve(movieLists);
    } catch (e) {
      reject(e);
    }
  });
};

movies(
  "https://jadwalnonton.com/bioskop/di-surabaya/tunjungan-xxi-surabaya.html"
);

module.exports = movies;
