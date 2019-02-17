#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const cli_color_1 = __importDefault(require("cli-color"));
const cli_table_1 = __importDefault(require("cli-table"));
const versioning_1 = require("./versioning");
const module_1 = require("./module/module");
const { area: getArea, findArea } = module_1.area;
commander_1.default
    .version(versioning_1.version)
    .description(versioning_1.description)
    .option('-d, --daerah <daerah>')
    .action((options) => __awaiter(this, void 0, void 0, function* () {
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
        };
        let moviesQuestionState = {
            url: '',
            selectedMovie: ''
        };
        //constructor section
        if (options.daerah) {
            let findAreaResult = yield findArea(options.daerah);
            if (findAreaResult !== undefined) {
                areaQuestionState.selectedArea = findAreaResult.locale;
                areaQuestionState.url = findAreaResult.url;
                theaterQuestionState.url = findAreaResult.url;
            }
        }
        while (!isExit) {
            if (areaQuestionState.selectedArea === '') {
                const getAreaResult = yield getArea(areaQuestionState.page);
                if (!getAreaResult) {
                    throw new Error("No Data Found");
                }
                let { locales, nextPage, prevPage } = getAreaResult;
                let choices = locales.map(local => local.locale);
                choices.push(new inquirer_1.default.Separator());
                if (nextPage !== undefined)
                    choices.push('next');
                if (prevPage !== undefined)
                    choices.push('previous');
                choices.push('exit');
                let answer = yield inquirer_1.default.prompt([{
                        type: 'list',
                        name: 'area',
                        message: cli_color_1.default.red('Mau nonton di daerah mana gan?'),
                        pageSize: 15,
                        choices
                    }]);
                if (answer.area === 'exit') {
                    console.log('Terima Kasih...');
                    isExit = true;
                }
                else if (answer.area === 'next')
                    areaQuestionState.page++;
                else if (answer.area === 'previous')
                    areaQuestionState.page--;
                else {
                    const findLocale = locales.find(({ locale }) => locale === answer.area);
                    if (findLocale) {
                        const { locale, url } = findLocale;
                        areaQuestionState.selectedArea = locale;
                        areaQuestionState.url = url;
                        theaterQuestionState.url = url;
                    }
                }
            }
            else if (theaterQuestionState.selectedTheater === '') {
                let { theaters, nextLink, prevLink } = yield module_1.theater(theaterQuestionState.url);
                let choices = theaters.map(({ theater_name }) => theater_name);
                choices.push(new inquirer_1.default.Separator());
                if (nextLink !== undefined)
                    choices.push('next');
                if (prevLink !== undefined)
                    choices.push('previous');
                choices.push('ganti daerah');
                choices.push('exit');
                let answer = yield inquirer_1.default.prompt([{
                        type: 'list',
                        name: 'theater',
                        message: `Silahkan pilih bioskopnya gan (daerah: ${areaQuestionState.selectedArea}):`,
                        pageSize: choices.length,
                        choices
                    }]);
                if (answer.theater === 'exit') {
                    console.log('Terima Kasih...');
                    isExit = true;
                }
                else if (answer.theater === 'next' && nextLink)
                    theaterQuestionState.url = nextLink;
                else if (answer.theater === 'previous' && prevLink)
                    theaterQuestionState.url = prevLink;
                else if (answer.theater === 'ganti daerah') {
                    areaQuestionState = {
                        url: '',
                        page: 0,
                        selectedArea: ''
                    };
                }
                else {
                    const findTheater = theaters.find(({ theater_name }) => theater_name === answer.theater);
                    if (findTheater) {
                        theaterQuestionState.selectedTheater = findTheater;
                        moviesQuestionState.url = theaterQuestionState.selectedTheater.url;
                    }
                }
            }
            else if (moviesQuestionState.url !== '') {
                const { movieLists, schedule } = yield module_1.movie(moviesQuestionState.url);
                let table = new cli_table_1.default({
                    head: [cli_color_1.default.red('No'), cli_color_1.default.red('Title'), cli_color_1.default.red('Rating'), cli_color_1.default.red('Genre'), cli_color_1.default.red('Duration'), cli_color_1.default.red('Available Time'), cli_color_1.default.red('Price')],
                    chars: {
                        'top': '═',
                        'top-mid': '╤',
                        'top-left': '╔',
                        'top-right': '╗',
                        'bottom': '═',
                        'bottom-mid': '╧',
                        'bottom-left': '╚',
                        'bottom-right': '╝',
                        'left': '║',
                        'left-mid': '╟',
                        'mid': '─',
                        'mid-mid': '┼',
                        'right': '║',
                        'right-mid': '╢',
                        'middle': '│'
                    }
                });
                if (movieLists.length > 0) {
                    movieLists.forEach(({ title, rating, genre, duration, available_hours, price }, index) => {
                        if (available_hours) {
                            available_hours = cli_color_1.default.bgRedBright.black('unavailable');
                        }
                        if (rating === '17+') {
                            rating = cli_color_1.default.bgRedBright.black(rating);
                        }
                        else if (rating === '13+') {
                            rating = cli_color_1.default.bgBlueBright.black(rating);
                        }
                        else if (rating === 'SU') {
                            rating = cli_color_1.default.bgGreen.black(rating);
                        }
                        table.push([index + 1, title, rating, genre, duration, available_hours, price]);
                    });
                }
                console.log(`Jadwal film untuk: ${schedule}`);
                console.log(`Area: ${areaQuestionState.selectedArea.toLocaleLowerCase().replace(/ /g, '-')} \nBioskop: ${theaterQuestionState.selectedTheater.theater_name}
                    `);
                console.log(table.toString());
                let answer = yield inquirer_1.default.prompt([{
                        type: 'list',
                        name: 'after_movie',
                        message: 'Selanjutnya apa gan?',
                        choices: [
                            'ganti bioskop',
                            'ganti daerah',
                            'exit'
                        ]
                    }]);
                if (answer.after_movie === 'exit') {
                    console.log('Terima Kasih...');
                    isExit = true;
                }
                else if (answer.after_movie === 'ganti daerah') {
                    areaQuestionState = {
                        url: '',
                        page: 0,
                        selectedArea: ''
                    };
                    theaterQuestionState.selectedTheater = '';
                }
                else if (answer.after_movie === 'ganti bioskop') {
                    theaterQuestionState.selectedTheater = '';
                }
            }
        }
    }
    catch (e) {
        console.log("Maaf, ada gangguan :(");
    }
}))
    .parse(process.argv);
