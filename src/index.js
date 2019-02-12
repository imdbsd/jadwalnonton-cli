const program = require('commander');
const inquirer = require('inquirer');
const clc = require("cli-color");
const Table = require('cli-table3');

const area = require('./module/area');
const theater = require('./module/theater');
const movies = require('./module/movies');

program
  .version('0.0.1')
  .description('jadwalnonton.com unofficial CLI tool')
  .option('-a, --area <area>')
  .option('-t, --theater <theater>')
  .action(async options => {    
    try {
        // console.log(options.area);
      // console.log(options.theater);
      // console.log(options.movie);
      let isExit = false;
      let page = 0;
      let selectedAnswer = '';
      
      let selectedArea = '';

      let theaterQuestionState = {
        url: '',
        selectedTheater: ''
      }

      let moviesQuestionState = {
        url: '',
        selectedMovie: ''
      }
      
      while(!isExit) {
        if(selectedArea === '') {
          let { locales, nextPage, prevPage } = await area(page);
          let question = locales.map(local => local.locale);

          if(nextPage !== undefined) question.push('next');
          if(prevPage !== undefined) question.push('previous');
          question.push('exit');

          // console.log({question})

          let answer = await inquirer.prompt([{
            type: 'rawlist',
            name: 'area',
            message: clc.red('where is your region'),
            choices: question
          }]);
          // console.log({answer})
          if(answer.area === 'exit') isExit = true;
          else if(answer.area === 'next') page++;
          else if(answer.area === 'previous') page--;
          else {
            selectedAnswer = locales.find(({locale}) => locale === answer.area);
            // console.log(selectedAnswer)   
            selectedArea = selectedAnswer;
            theaterQuestionState.url = selectedAnswer.url;
            // console.log({theaterQuestionState})
          }
        }
        else if(theaterQuestionState.selectedTheater === '') {  
          console.log({theaterQuestionState})      
          let { theaters, nextLink, prevLink } = await theater(theaterQuestionState.url);
          let question = theaters.map(({ theater_name }) => theater_name);

          if(nextLink !== undefined) question.push('next');
          if(prevLink !== undefined) question.push('previous');
          question.push('reset my region');
          question.push('exit');

          // console.log({question})
          let answer = await inquirer.prompt([{
            type: 'rawlist',
            name: 'theater',
            message: 'Which theater you want to go ?',
            choices: question
          }]);
          // console.log({answer})
          if(answer.area === 'exit') isExit = true;
          else if(answer.area === 'next') theaterQuestionState.url = nextLink;
          else if(answer.area === 'previous') theaterQuestionState.url = prevLink;
          else {
            theaterQuestionState.selectedTheater = theaters.find(({theater_name}) => theater_name === answer.theater);
            console.log({theaterQuestionState})
            moviesQuestionState.url = theaterQuestionState.selectedTheater.url
          }        
        }
        else if(moviesQuestionState.selectedMovie === '') {
          console.log({moviesQuestionState})
          const movieList = await movies(moviesQuestionState.url);
          let table = new Table({
            head: [clc.bgWhite.black('No'), clc.bgWhite.black('Title'), clc.bgWhite.black('Rating'), clc.bgWhite.black('Genre'), clc.bgWhite.black('Duration'), clc.bgWhite.black('Available Time'), clc.bgWhite.black('Price')],
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
          movieList.forEach(({ title, rating, genre, duration, hours, price }, index) => { 

            table.push([index + 1, title, rating, genre, duration, hours.join(', '), price])
          });                            
          console.log(table.toString());          
          let answer = await inquirer.prompt([{
            type: 'list',
            name: 'after_movie',
            message: 'What next?',
            choices: [
              'restart selected theater',
              'restart my region',
              'quit'
            ]
          }]);
          console.log({answer})
          if(answer.after_movie === 'quit') isExit = true;
        }
      }
    }
    catch(e) {
      console.log(e)
    }
  })
  .parse(process.argv);