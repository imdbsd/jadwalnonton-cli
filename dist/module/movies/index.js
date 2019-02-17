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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const movies = (url) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: html } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(html);
            const target = $('#main > div.mtom20 .item');
            if (!target || target.length === 0) {
                reject("No Data found");
            }
            const movieLists = target.map((_index, element) => {
                let [genre, duration] = $(element).find('.sched_desc > p:nth-child(2)').text().split(' - ');
                let available_hours = $(element).find('.usch > li.active').map((_index, hour) => {
                    return $(hour).text();
                }).get();
                let movie = {
                    more_info: $(element).find('h2 > a').attr('href'),
                    title: $(element).find('h2 > a').text(),
                    rating: $(element).find('.rating').text() === '' ? 'unrated' : $(element).find('.rating').text(),
                    available_hours,
                    genre,
                    duration,
                    price: $(element).find('.htm').text().replace('Harga tiket masuk ', ''),
                };
                return movie;
            }).get();
            resolve({
                movieLists,
                schedule: $('.theafilter span.right').text()
            });
        }
        catch (e) {
            reject(e);
        }
    }));
};
exports.default = movies;
