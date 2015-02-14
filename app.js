var express = require('express');
var bodyParser = require('body-parser');
var mobiusModule = require('./lib/mobiusClient');
var mongooseModule = require('./lib/mongooseClient');
var appConfig = require('./config/config.json');
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

// status

router.get('/status/ping', function(req, res) {
  res.send('pong')
})

// getOffer

router.get('/getOffer/:id', function(req, res) {
    var offerId = req.params.id;

    mobiusIns.getOffer(offerId, function (error, offer) {
        if (error) {
            res.status(404).send();
        } else {
            res.send(offer);
        }
    });
});

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

router.post('/carousels', function(req, res) {
    var carousel = new Carousel({
        key: req.body.key,
        name: req.body.name,
        department: req.body.department
    });

    carousel.save(function () {
        res.send('inserted!');
    });
});

router.delete('/carousels', function(req, res) {
    Carousel.where().findOneAndRemove({
        key: req.body.key,
        department: req.body.department
    }, function () {
        res.send('removed!');
    });
});

app.use('/', router);

app.listen(8080, function () {
    console.log('server started!');
});
