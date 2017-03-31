/**
 * Geo Utils used through out the project.
 */
(() => {
    
    const nconf = require('nconf');
    
    const NodeGeocoder = require('node-geocoder');
    /**
     * Docs: https://github.com/davidwood/node-geopoint
     */
    const GeoPointUtil = require('geopoint');
    
    /**
     * Docs: https://github.com/nchaulet/node-geocoder
     */
    let   GeoCoderSingleton = null;
    
    module.exports = {
        initialize: function(opts) {
            opts.nodeGeoCoderOpts.apiKey = nconf.get( nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), opts.geocoderTokenName) );
            
            GeoCoderSingleton = NodeGeocoder(opts.nodeGeoCoderOpts);
        },
        getGeoCoder: function(){
            const instance = GeoCoderSingleton;
            return instance;
        },
        GeoPoint: GeoPointUtil
    };
})();