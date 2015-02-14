'use strict';

var mongoose = require('mongoose');

module.exports = function (config) {
    return {
        init: function () {
            this.connect();
            return mongoose;
        },
        connect: function () {
            mongoose.connect(config.mongoHost);
            var mongo = mongoose.connection;

            mongo.on('error', console.error.bind(console, 'mongo connection error:'));
            mongo.once('open', function (callback) {
              console.log('mongo connection opened!');
            });
        }
    };
};
