const express = require('express'),
 http = require('http');
const hostname = 'localhost';
const port = 3000;
const app = express();

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to sever");
}, (err) => {console.log(err);});

const dishRouter = require('./routes/dishRouter');
// app.use('/dishes',dishRouter);

const promoRouter = require('./routes/promoRouter');
app.use('/promotions',promoRouter);

const leaderRouter = require('./routes/leaderRouter');
app.use('/leaders',leaderRouter);
function auth(req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated !');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
    var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        next();
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
    }
}
app.use(auth);

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());



// app.all('/dishes',(req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// });
// app.get('/dishes',(req,res,next) => {
//     res.end('Will send all the disher to you!');
// });
// app.post('/dishes',(req,res,next) => {
//     res.end('Will add the dish: ' +req.body.name + 'with details: ' + req.body.description);
// });
// app.put('/dishes',(req,res,next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes');
// });
// app.delete('/dishes',(req,res,next) => {
//     res.end('Deleting all dishes');
// });
// app.get('/dishes/:dishID',(req,res,next) => {
//     res.end('Will send detail of the dish ' + req.params.dishID+' to you!');
// });
// app.post('/dishes/:dishID',(req,res,next) => {
//     res.statusCode = 200;
//     res.end('POST operation not supported on /dishes' + req.params.dishID);
// });
// app.put('/dishes/:dishID',(req,res,next) => {
//     res.write('Updating the dish '+ req.params.dishID+ '\n');
//     res.end('Will update the dish: '+req.body.description);
// });
// app.delete('/dishes/:dishID',(req,res,next) => {
//     res.end('Deleting dish: ' +req.params.dishID);
// });

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

});