const express = require('express');
const app = express();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = process.env.port || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()) 

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
    for (let i = 0 ; i< req.body.time_from; i++) {
        classes.push(Class(req.body.weekday[i], req.body.time_from[i], req.body.time_to[i]));
    }

    let proffy = {
        name: req.body.name,
        photoURL: req.body.avatar,
        phone: req.body.whatsapp,
        bio: req.body.bio,
        subject: req.body.subject,
        price: req.body.cost,
        classes: classes
    };

    //res.send(proffy);
    res.send(JSON.stringify(req.body));
});

app.listen(PORT, ()=>{
    console.log('Server online');
});
