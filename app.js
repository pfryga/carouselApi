var express = require('express');
var router = express.Router();
var mobiusModule = require('./lib/mobiusClient');
var appConfig = require('./config/config.json');
var mobiusIns = mobiusModule(appConfig.mobius);

var app = express();

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

app.use('/', router);

app.listen(8080, function () {
    console.log('server started!');
});
