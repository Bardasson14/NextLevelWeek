const express = require('express');
const app = express();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const _handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { query } = require('express');
const convertToMinutes = require('./utils/utils');
const db = mongoose.connection;
require('./models/Proffy');
const Proffy = mongoose.model('proffies');
//const db = mongoose.connection;
const PORT = process.env.port || 8081;

const subjects = ["Artes", "Biologia", "Ciências", "Educação Física", "Física", "Geografia", "História", "Matemática", "Português", "Química"]

const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()) 

mongoose.connect('mongodb://localhost/proffy', {
    useNewUrlParser: true
}).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log('ERROR! ' + err)
})

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/study', (req, res)=>{
    const filters = req.query;

    if (!filters.time|| !filters.subject || !filters.weekday) {
        Proffy.find().then((teachers)=>{
            return res.render('study', {filters, subjects, weekdays, teachers})
        })
    }

    parsedTime = convertToMinutes(filters.time);
    console.log(parsedTime);
    Proffy.find({
        'subject': filters.subject,
        'classes.from': {$lte: parsedTime},/* : {$elemMatch: {'from': {$gte: parsedTime}, 'to': {$lt: parsedTime}, 'weekday': filters.weekday}} */
        'classes.to': {$gt: parsedTime},
        'classes.weekday': filters.weekday
    }).then((teachers)=>{
        console.log("teachers = " + teachers);
        res.render('study', {teachers: teachers, subjects: subjects, weekdays: weekdays});
    });
});

app.get('/teach', (req, res)=>{
    res.render('teach', {subjects: subjects, weekdays: weekdays});
});

app.post('/register', (req, res)=>{
    console.log(req.body);
    let classes = [];
    let weekdays = [];
    let times_from = [];
    let times_to = [];
    if (! Array.isArray
        (req.body.weekday) ){
        weekdays.push(req.body.weekday)
        times_from.push(req.body.time_from);
        times_to.push(req.body.time_to);
    }

    else {
        weekdays = req.body.weekday;
        times_from = req.body.time_from;
        times_to = req.body.time_to;
    }

    for (let i = 0 ; i< times_from.length; i++) {
        const classTime = {
            'weekday': weekdays[i],
            'from': parseInt(convertToMinutes(times_from[i])) ,
            'to': parseInt(convertToMinutes(times_to[i])) 
        }
        classes.push(classTime);       
    }

    const proffy = ( {
        name: req.body.name,
        photoURL: req.body.avatar,
        phone: req.body.whatsapp,
        bio: req.body.bio,
        subject: req.body.subject,
        price: req.body.cost,
        classes: classes
    });

    
    new Proffy(proffy).save().then(()=>{
        res.redirect('/');
    });
});

app.listen(PORT, ()=>{
    console.log('Server online');
});
