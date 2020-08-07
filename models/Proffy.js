const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Proffy = new Schema({
    name: {
        type: String, 
        required: true
    },

    photoURL: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    classes: {
        type: Array
    }
    
});

mongoose.model('proffies', Proffy);