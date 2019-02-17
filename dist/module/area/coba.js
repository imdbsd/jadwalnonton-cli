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
const totalReturnPerpage = 10;
const area = (page = 0, initArea) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: html } = yield axios_1.default.get('https://jadwalnonton.com/bioskop');
            const $ = cheerio_1.default.load(html);
            let locales;
            locales = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a').map((_index, element) => {
                return {
                    locale: $(element).text(),
                    url: $(element).attr('href')
                };
            }).get();
            if (initArea) {
                const findStatuslocales = locales.find(({ locale }) => {
                    return locale.toLowerCase().replace(/ /g, '-') === initArea;
                });
                return resolve(findStatuslocales);
            }
            let slicedLocales = locales.slice(page * totalReturnPerpage, page * totalReturnPerpage + totalReturnPerpage);
            let returnedData = {
                locales: slicedLocales
            };
            if (page > 0) {
                returnedData.prevPage = page - 1;
            }
            if (locales.slice((page + 1) * totalReturnPerpage, (page + 1) * totalReturnPerpage + totalReturnPerpage).length !== 0) {
                returnedData.nextPage = page + 1;
            }
            resolve(returnedData);
        }
        catch (e) {
            reject(e);
        }
    }));
};
exports.area = area;
const findArea = (initArea) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: html } = yield axios_1.default.get('https://jadwalnonton.com/bioskop');
            const $ = cheerio_1.default.load(html);
            let locales;
            locales = $('#ctfilcon > div.filterlist > ul:nth-child(1) li a').map((_index, element) => {
                return {
                    locale: $(element).text(),
                    url: $(element).attr('href')
                };
            }).get();
            const findStatuslocales = locales.find(({ locale }) => {
                return locale.toLowerCase().replace(/ /g, '-') === initArea;
            });
            resolve(findStatuslocales);
        }
        catch (e) {
            reject(e);
        }
    }));
};
exports.findArea = findArea;
