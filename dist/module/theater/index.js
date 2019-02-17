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
const theater = (url) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: html } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(html);
            let theaters;
            const target = $('#main > div.row.clearfix.thlist .item.theater');
            if (!target || target.length === 0) {
                reject("No Data Found");
            }
            theaters = target.map((_index, element) => {
                return {
                    theater_name: $(element).find('.judul').text(),
                    url: $(element).find('.mojadwal').attr('href')
                };
            }).get();
            const nextLink = $('a[title="Selanjutnya"]').attr('href');
            const prevLink = $('a[title="Sebelumnya"]').attr('href');
            let returnedData = {
                theaters
            };
            if (nextLink) {
                returnedData.nextLink = nextLink;
            }
            if (prevLink) {
                returnedData.prevLink = prevLink;
            }
            resolve(returnedData);
        }
        catch (e) {
            reject(e);
        }
    }));
};
exports.default = theater;
