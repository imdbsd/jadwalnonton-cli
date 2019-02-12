#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const clc = require("cli-color");
const Table = require('cli-table');

const { version, description } = require('./versioning');

const area = require('./module/area');
const theater = require('./module/theater');
const movies = require('./module/movies');

program
  .version(version)
  .description(description)
  .option('-d, --daerah <daerah>')  
  .action(async options => {    
    try {      
      let isExit = false;          
      
      let areaQuestionState = {
        url: '',
        page: 0,
        selectedArea: ''
      };

      let theaterQuestionState = {
        url: '',
        selectedTheater: ''
      }

      let moviesQuestionState = {
        url: '',
        selectedMovie: ''
      }

      //constructor section
      if(options.daerah) {
        let findArea = await area(0, options.daerah);
        if(findArea) {
          areaQuestionState.selectedArea = findArea.locale;
          areaQuestionState.url = findArea.url;
          theaterQuestionState.url = findArea.url;
        }        
      }
      
      while(!isExit) {
        if(areaQuestionState.selectedArea === '') {
          let { locales, nextPage, prevPage } = await area(areaQuestionState.page);
          let choices = locales.map(local => local.locale);

          choices.push(new inquirer.Separator())
          
          if(nextPage !== undefined) choices.push('next');
          if(prevPage !== undefined) choices.push('previous');
          choices.push('exit');

          let answer = await inquirer.prompt([{
            type: 'list',
            name: 'area',
            message: clc.red('Mau nonton di daerah mana gan?'),
            pageSize: 15,
            choices
          }]);
          
          if(answer.area === 'exit') {
            console.log('Terima Kasih...');
            isExit = true;
          }
          else if(answer.area === 'next') areaQuestionState.page++;
          else if(answer.area === 'previous') areaQuestionState.page--;
          else {
            const { locale, url } = locales.find(({locale}) => locale === answer.area);
            areaQuestionState.selectedArea = locale;
            areaQuestionState.url = url;
            theaterQuestionState.url = url;
          }          
        }
        else if(theaterQuestionState.selectedTheater === '') {            
          let { theaters, nextLink, prevLink } = await theater(theaterQuestionState.url);
          let question = theaters.map(({ theater_name }) => theater_name);
          
          question.push(new inquirer.Separator())
          if(nextLink !== undefined) question.push('next');
          if(prevLink !== undefined) question.push('previous');
          question.push('ganti daerah');
          question.push('exit');

          let answer = await inquirer.prompt([{
            type: 'list',
            name: 'theater',
            message: `Silahkan pilih bioskopnya gan (daerah: ${areaQuestionState.selectedArea}):`,
            pageSize: question.length,
            choices: question
          }]);
          
          if(answer.theater === 'exit') {
            console.log('Terima Kasih...');
            isExit = true;
          }
          else if(answer.theater === 'next') theaterQuestionState.url = nextLink;
          else if(answer.theater === 'previous') theaterQuestionState.url = prevLink;
          else if(answer.theater === 'ganti daerah') {
            areaQuestionState = {
              url: '',
              page: 0,
              selectedArea: ''
            };
          }
          else {
            theaterQuestionState.selectedTheater = theaters.find(({theater_name}) => theater_name === answer.theater);
            
            moviesQuestionState.url = theaterQuestionState.selectedTheater.url
          }        
        }
        else if(moviesQuestionState.selectedMovie === '') {          
          const { movieLists, schedule } = await movies(moviesQuestionState.url);          
                  
          let table = new Table({
            head: [clc.red('No'), clc.red('Title'), clc.red('Rating'), clc.red('Genre'), clc.red('Duration'), clc.red('Available Time'), clc.red('Price')],
            chars: { 
              'top': '═' , 
              'top-mid': '╤' , 
              'top-left': '╔' , 
              'top-right': '╗', 
              'bottom': '═' , 
              'bottom-mid': '╧' , 
              'bottom-left': '╚' , 
              'bottom-right': '╝', 
              'left': '║' , 
              'left-mid': '╟' , 
              'mid': '─' , 
              'mid-mid': '┼', 
              'right': '║' , 
              'right-mid': '╢' , 
              'middle': '│' 
            }       
          });
          
          if(movieLists.length > 0) {
            movieLists.forEach(({ title, rating, genre, duration, hours, price }, index) => {
              if(hours.length === 0) {
                hours = clc.bgRedBright.black('unavailable');
              }
              if(rating === '17+'){
                rating = clc.bgRedBright.black(rating);
              }
              else if(rating === '13+'){
                rating = clc.bgBlueBright.black(rating);
              }
              else if(rating === 'SU') {
                rating = clc.bgGreen.black(rating);
              }
              table.push([index + 1, title, rating, genre, duration, hours, price])
            });
          }          
          
          console.log(`Jadwal film untuk: ${schedule}`);          
          console.log(`Area: ${areaQuestionState.selectedArea.toLocaleLowerCase().replace(/ /g, '-')} \nBioskop: ${theaterQuestionState.selectedTheater.theater_name}
          `)
          console.log(table.toString());         
          let answer = await inquirer.prompt([{
            type: 'list',
            name: 'after_movie',
            message: 'Selanjutnya apa gan?',
            choices: [
              'ganti bioskop',
              'ganti daerah',
              'exit'
            ]
          }]);
          
          if(answer.after_movie === 'exit') {
            console.log('Terima Kasih...');
            isExit = true;
          }
          else if(answer.after_movie === 'ganti daerah') {
            areaQuestionState = {
              url: '',
              page: 0,
              selectedArea: ''
            };
            theaterQuestionState.selectedTheater = '';
          }
          else if(answer.after_movie === 'ganti bioskop') {
            theaterQuestionState.selectedTheater = '';
          }
        }
      }
    }
    catch(e) {
      console.log("Maaf, ada gangguan :(");
      // console.log(e)
    }
  })
  .parse(process.argv);
