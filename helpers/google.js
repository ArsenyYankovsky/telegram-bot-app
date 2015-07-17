var http = require('http');
var _ = require('underscore');
var querystring = require('querystring');
var request = require('request');

var google = {
    search: function(query, callback) {
        // Execute the request
        var googleRequest = http.request("http://ajax.googleapis.com/ajax/services/search/images?v=1.0&as_filetype=jpg%20png&rsz=8&q=" + encodeURI(query), function(googleResponse) {
            googleResponse.setEncoding('utf8');

            // Read the response
            var output = '';
            googleResponse.on('data', function(chunk) {
                output += chunk;
            });

            // Return the received data when finished, using the specified callback function
            googleResponse.on('end', function() {
                var responseData = JSON.parse(output).responseData;
                if (responseData.results.length > 0) {
                    var index = Math.floor(Math.random() * responseData.results.length),
                        imageUrl = responseData.results[index].unescapedUrl,
                        tbUrl = responseData.results[index].tbUrl;
                    console.log(query + ' ' + imageUrl);
                    google.getImage(imageUrl, callback, tbUrl);
                }
                else {
                    callback('Google can\'t find it for you');
                }


            });
        });

        // Log errors and return an error message instead of weather message
        googleRequest.on('error', function(err) {
            callback('Sorry, could not get the data from Google.');
        });

        googleRequest.end();
    },

    getImage: function(url, callback, tbUrl) {
        request
            .get(url)
            .on('response', function(response) {
                console.log(response.headers['content-type']) // 'image/png'
                if (response.headers['content-type'].split('/')[0] !== 'image') {
                    if (!tbUrl) {
                        callback('can\'t load even preview');
                        return;
                    }
                    console.log('tab url : ' + tbUrl);
                    google.getImage(tbUrl, callback);
                    return;
                }
                callback(response, true, response.headers['content-type'], url);
            });
    }
};
module.exports = google;