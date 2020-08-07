const express = require('express');
const app = express();
const path = require('path');
const expressHandlebars = require('express-handlebars');
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/study', (req, res)=>{
    res.render('study');
});

app.get('/teach', (req, res)=>{
    res.render('teach');
});

app.listen(PORT, ()=>{
    console.log('Server online');
});
