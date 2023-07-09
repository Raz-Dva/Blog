// const mongoose = require("mongoose");
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const articleScheme = new Schema({
    author: {
        type: String,
        reuqire: true
    },
    title: {
        type: String,
        reuqire: true,
        default: "NoName"
    },
    text: {
        type: String,
        reuqire: true
    },
    date: {
        type: Date,
        reuqire: true,
        default: Date.now
    },
    categories: {
        type: Array
    },
    imgPath: {
        type: String
    },
    imgURL: {
      type: String
    }
});

export default mongoose.model('article', articleScheme);

