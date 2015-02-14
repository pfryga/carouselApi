'use strict';

var request = require('request');
var base64Encode = require('base64').encode;

module.exports = function (config) {
    var encodedCredentials = base64Encode(config.clientId + ':' + config.clientSecret);

    return {
        authenticate: function (callback) {
            var autenticationUrl = config.mobiusHost + config.authenticationPath;

            request.get({
                    url: autenticationUrl,
                    headers: {
                        'Authorization': 'Basic ' + encodedCredentials
                    }
                }, function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                        callback(error || true, null);
                    } else {
                        var responseJSON = JSON.parse(body);
                        callback(null, responseJSON.access_token);
                    }
                }
            );
        },
        getOffer: function (offerId, callback) {
            var offerGetCallback = function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    callback(error || true, null);
                } else {
                    callback(null, JSON.parse(body));
                }
            };

            var getOfferPath = config.mobiusHost + config.offerPath + offerId;
            this.authenticate(function (error, accessToken) {
                request.get({
                        url: getOfferPath + '?access_token=' + accessToken
                    },
                    offerGetCallback
                );
            });
        }
    };
};
