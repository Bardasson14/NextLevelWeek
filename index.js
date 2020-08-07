const express = require('express');
const app = express();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./models/Proffy');
const Proffy = mongoose.model('proffies');
//const db = mongoose.connection;
const PORT = process.env.port || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
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
    res.render('study');
});

app.get('/teach', (req, res)=>{
    res.render('teach');
});

app.post('/register', (req, res)=>{
    let classes = [];
    const time_from = Array.from(req.body.time_from);
    const time_to = Array.from(req.body.time_to);
    console.log("Time from: " + time_from);
    console.log("Time to: " + time_to);
    for (let i = 0 ; i< req.body.weekday.length; i++) {
        classes.push({
            'weekday': req.body.weekday[i], 
            'from': time_from[i], 
            'to': time_to[i]});
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
