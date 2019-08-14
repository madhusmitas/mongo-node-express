var express = require('express'),
movie = require('./movie');

var app = express();

app.configure(function () {
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
});

app.get('/movie', movie.findAll);
app.get('/movie/:id', movie.findById);
app.post('/movie', movie.addmovie);
app.put('/movie/:id', movie.updatemovie);
app.delete('/movie/:id', movie.deletemovie);

app.listen(3000);
console.log('Listening on port 3000...');