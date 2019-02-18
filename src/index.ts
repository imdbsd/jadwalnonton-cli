#!/usr/bin/env node

import program from 'commander';
import inquirer, { Answers } from 'inquirer';
import clc from "cli-color";
import Table from 'cli-table';

import { version, description } from './versioning';
import { area, movie as getMovie, theater as getTheater } from './module/module';

type TTheaterQuestionState = {
    url: string,
    selectedTheater: {
        theater_name: string,
        url?: string
    } | any
}

type TMovieQuestionState = {
    url: string,
    selectedMovie: string
}

const { area: getArea, findArea } = area;

program
    .version(version)
    .description(description)
    .option('-d, --daerah <daerah>')
    .action(async (options: any) => {    
        try {
            let isExit = false;
            let areaQuestionState = {
                url: '',
                page: 0,
                selectedArea: ''
            };
        
            let theaterQuestionState: TTheaterQuestionState = {
                url: '',
                selectedTheater: ''
            }
        
            let moviesQuestionState: TMovieQuestionState= {
                url: '',
                selectedMovie: ''
            }

            //constructor section
            if(options.daerah) {
                let findAreaResult = await findArea(options.daerah);
                if(findAreaResult !== undefined) {
                    areaQuestionState.selectedArea = findAreaResult.locale;
                    areaQuestionState.url = findAreaResult.url;
                    theaterQuestionState.url = findAreaResult.url;
                }        
            }
            
            while(!isExit) {
                if(areaQuestionState.selectedArea === '') {
                    const getAreaResult = await getArea(areaQuestionState.page);
                    if(!getAreaResult){
                        throw new Error("No Data Found");
                    }   
                    let { locales, nextPage, prevPage } = getAreaResult;                 
                    let choices: any = locales.map(local => local.locale);
                
                    choices.push(new inquirer.Separator())
                    if(nextPage !== undefined) choices.push('next');
                    if(prevPage !== undefined) choices.push('previous');
                    choices.push('exit');

                    let answer: Answers = await inquirer.prompt([{
                        type: 'list',
                        name: 'area',
                        message: 'Mau nonton di daerah mana gan?',
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
                        const findLocale = locales.find(({locale}) => locale === answer.area);
                        if(findLocale){
                            const { locale, url } = findLocale
                            areaQuestionState.selectedArea = locale;
                            areaQuestionState.url = url;
                            theaterQuestionState.url = url;
                        }                    
                    }          
                }
                else if(theaterQuestionState.selectedTheater === '') {            
                    let { theaters, nextLink, prevLink } = await getTheater(theaterQuestionState.url);
                    let choices: any = theaters.map(({ theater_name }) => theater_name);
                
                    choices.push(new inquirer.Separator())
                    if(nextLink !== undefined) choices.push('next');
                    if(prevLink !== undefined) choices.push('previous');
                    choices.push('ganti daerah');
                    choices.push('exit');

                    let answer: Answers = await inquirer.prompt([{
                        type: 'list',
                        name: 'theater',
                        message: `Silahkan pilih bioskopnya gan (daerah: ${areaQuestionState.selectedArea}):`,
                        pageSize: choices.length,
                        choices
                    }]);

                    if(answer.theater === 'exit') {
                        console.log('Terima Kasih...');
                        isExit = true;                        
                    }

                    else if(answer.theater === 'next' && nextLink) theaterQuestionState.url = nextLink;
                    else if(answer.theater === 'previous' && prevLink) theaterQuestionState.url = prevLink;
                    else if(answer.theater === 'ganti daerah') {
                        areaQuestionState = {
                            url: '',
                            page: 0,
                            selectedArea: ''
                        };
                    }
                    else {
                        const findTheater = theaters.find(({theater_name}) => theater_name === answer.theater);
                        if(findTheater){
                            theaterQuestionState.selectedTheater = findTheater;
                            moviesQuestionState.url = theaterQuestionState.selectedTheater.url
                        }                        
                    }                            
                }
                else if(moviesQuestionState.url !== '') {                              
                    const { movieLists, schedule } = await getMovie(moviesQuestionState.url);
                        
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
                        movieLists.forEach(({ title, rating, genre, duration, available_hours, price }, index) => {                
                            if(!available_hours) {
                                console.log({available_hours})
                                available_hours = clc.bgRedBright.black('unavailable');
                            }
                            else {
                                if(typeof available_hours !== 'string'){
                                    available_hours = available_hours.reduce((temp, hour, index): string => {                                        
                                        if(index === 1){
                                            temp = clc.bgGreenBright.black(temp);
                                        }
                                        if(index % 2 !== 0){
                                            temp += ` ${clc.bgGreenBright.black(hour)}\n\n`;
                                        }
                                        else{
                                            temp += `${clc.bgGreenBright.black(hour)}`
                                        }
                                        return temp;
                                    });
                                }                                
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
                            table.push([index + 1, title, rating, genre, duration, available_hours, price])
                        });
                    }          
                
                    console.log(`Jadwal film untuk: ${schedule}`);          
                    console.log(`Area: ${areaQuestionState.selectedArea.toLocaleLowerCase().replace(/ /g, '-')} \nBioskop: ${theaterQuestionState.selectedTheater.theater_name}
                    `)
                    console.log(table.toString());         
                    let answer: any = await inquirer.prompt([{
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
        catch(e){
            console.log("Maaf, ada gangguan :(");
        }
    })
    .parse(process.argv);
