var express = require('express');
var bodyParser = require('body-parser');
var mobiusModule = require('./lib/mobiusClient');
var mongooseModule = require('./lib/mongooseClient');
var appConfig = require('./config/config.json');
var docs = require('express-mongoose-docs');
var router = express.Router();

var mobiusIns = mobiusModule(appConfig.mobius);
var mongooseIns = mongooseModule(appConfig.mongo);
var mongoose = mongooseIns.init();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// models

var Carousel = mongoose.model('Carousel', {
    key: String,
    name: String,
    department: String
});

var Department = mongoose.model('Department', {
    key: String,
    name: String
});

var Offer = mongoose.model('Offer', {
    department: String,
    carousel: String,
    id: String,
    name: String,
    mainImage: String
});

// cors

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// status

router.get('/status/ping', function(req, res) {
    res.send('pong')
})

// carousels

router.get('/carousels/:department', function(req, res) {
    Carousel.where({
        department: req.params.department
    }).find(function (err, elem) {
        if (err) return res.send(err);
        if (elem) {
            var response = {
                'collection': req.params.department,
                'items': elem
            };
            res.send(response);
        }
    });
});

router.post('/carousel', function(req, res) {
    var carousel = new Carousel({
        key: req.body.key,
        name: req.body.name,
        department: req.body.department
    });

    carousel.save(function () {
        res.send('created!');
    });
});

router.delete('/carousel', function(req, res) {
    Carousel.findOneAndRemove({
        key: req.body.key,
        department: req.body.department
    }, function () {
        res.send('removed!');
    });
});

// departments

router.get('/departments', function(req, res) {
    Department.find(function (err, elem) {
        if (err) return res.send(err);
        if (elem) {
            var response = {
                'collection': req.params.department,
                'items': elem
            };
            res.send(response);
        }
    });
});

router.post('/department', function(req, res) {
    var department = new Department({
        key: req.body.key,
        name: req.body.name
    });

    department.save(function () {
        res.send('created!');
    });
});

router.delete('/department', function(req, res) {
    Department.findOneAndRemove({
        key: req.body.key
    }, function () {
        res.send('removed!');
    });
});

// offers

router.get('/offer/:id', function(req, res) {
    var offerId = req.params.id;

    mobiusIns.getOffer(offerId, function (error, data) {
        if (error) {
            res.status(404).send();
        } else {
            res.send(data);
        }
    });
});

router.get('/offers/:department/:carousel', function(req, res) {
    Offer.where({
        department: req.params.department,
        carousel: req.params.carousel
    }).find(function (err, elem) {
        if (err) return res.send(err);
        if (elem) {
            var response = {
                'collection': req.params.department,
                'items': elem
            };
            res.send(response);
        }
    });
});

router.post('/offer/:id', function(req, res) {
    var offerId = req.params.id;

    mobiusIns.getOffer(offerId, function (error, data) {
        if (error) {
            res.status(404).send();
        } else {
            var offer = new Offer({
                department: req.body.department,
                carousel: req.body.carousel,
                id: data.id,
                name: data.name,
                mainImage: data.mainImage.small
            });

            offer.save(function () {
                res.send('created!');
            });
        }
    });
});

router.delete('/offer/:id', function(req, res) {
    Offer.findOneAndRemove({
        id: req.params.id,
        department: req.body.department,
        carousel: req.body.carousel
    }, function () {
        res.send('removed!');
    });
});

app.use('/', router);

docs(app, mongoose);

app.listen(8080, function () {
    console.log('server started!');
});
