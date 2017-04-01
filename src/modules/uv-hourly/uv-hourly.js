/**
 * Geo Utils used through out the project.
 *
 * TODO: Figure out spatial queries.
 */
(() => {

    let lib = {
        initialize: function() {/*no-op*/
        },
        badFormatToDate: function(sdate){
            var chunks = sdate.split(' ');

            var date = chunks[0].split('/');

            var month;
            var day = date[1];
            var year = date[2];

            var hour = chunks[1];
            var ampm = chunks[2];

            var military_hour = hour;
            if (ampm == 'PM')
                military_hour += 12;

            if (hour == '12' && ampm == 'AM')
                military_hour = 0;

            switch(date[0]){
            case 'JAN':
                month = 0;
                break;
            case 'FEB':
                month = 1;
                break;
            case 'MAR':
                month = 2;
                break;
            case 'APR':
                month = 3;
                break;
            case 'MAY':
                month = 4;
                break;
            case 'JUN':
                month = 5;
                break;
            case 'JUL':
                month = 6;
                break;
            case 'AUG':
                month = 7;
                break;
            case 'SEP':
                month = 8;
                break;
            case 'OCT':
                month = 9;
                break;
            case 'NOV':
                month = 10;
                break;
            case 'DEC':
                month = 11;
                break;
            }
            return new Date(year, month, day, military_hour);
        },
        getLatestUVScore: function() {
            const https = require('https');
            let url = 'https://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/CITY/lafayette/STATE/la/JSON';

            return new Promise((resolve) => {
                https.get(url, function(response) {
                    // Continuously update stream with data
                    let body = '';
                    response.on('data', function(d) {
                        body += d;
                    });

                    response.on('end', function() {

                        // Data reception is done, do whatever with it!
                        console.log(body);
                        var parsed = JSON.parse(body);

                        parsed.sort(function(a,b){
                            return lib.badFormatToDate(b.DATE_TIME) - lib.badFormatToDate(a.DATE_TIME);
                        });
                        console.log(parsed[0]);
                        resolve(parsed[0].UV_VALUE);
                    });
                });
            });
        }
    };

    module.exports = lib;
})();
