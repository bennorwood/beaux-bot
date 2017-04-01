/**
 * Geo Utils used through out the project.
 */
(() => {
    
    const nconf = require('nconf');
    const BlueBird = require('bluebird');
    
    const Geoservices = require('geoservices');
    const client = new Geoservices();
    
    const NodeGeocoder = require('node-geocoder');
    const options = {
        provider: 'google',
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: nconf.get('GOOGLE_MAPS_GEOCODER_ACCESS_TOKEN'), // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };
    /**
     * Docs for Turning addresses into Lat Long Coordinates
     * https://github.com/nchaulet/node-geocoder
     */
    const geocoder = NodeGeocoder(options);
    
    let lib = {
        initialize: function() {/*no-op*/},
        GeoCoderClient: geocoder,
        getLafayetteLocationItem: function(locationArray){
            for(let index=0; index < locationArray.length; index++){
                if(locationArray[index].city === 'Lafayette' && locationArray[index].administrativeLevels.level1long === 'Louisiana'){
                    return locationArray[index];
                }
            }
        },
        getFeatureServiceClient: function(params){
            return new Promise( (resolve, reject) => {
                let featureServiceClient = client.featureservice( params , function (err) {
                    if (err) {
                        console.error('GEO-UTILS ERROR: ' + err);
                        reject(err);
                    } else {
                        //promisify featureServiceClient
                        BlueBird.promisifyAll(featureServiceClient);
                        resolve(featureServiceClient);
                    }
                });
            });
        }
    };
    
    module.exports = lib;
})();