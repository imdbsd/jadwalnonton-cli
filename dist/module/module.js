"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const area = __importStar(require("./area"));
exports.area = area;
const movies_1 = __importDefault(require("./movies"));
exports.movie = movies_1.default;
const theater_1 = __importDefault(require("./theater"));
exports.theater = theater_1.default;
