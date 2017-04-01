(()=>{
    const path = require('path');
    
    const nconf    = require('nconf');
    const GeoUtils = require(path.join(nconf.get('paths:modulesDir'), 'geo-utils', 'geo-utils'));
    const prepareRequest = function(){
        
    };
    
    let featureClient = null;
    
    module.exports = function(opts){
        
        return {
            initialize: function(){
                console.log(opts);
                return GeoUtils.getFeatureServiceClient(opts.arcGisParams).then((client) => {
                    featureClient = client;
                    
                    return this;
                });
            },
            prepareResponse: function(message){
                console.log('$$$$');
                console.log(message.apiai.result);
                
                /* const queryParams = {
                    geometryType: 'esriGeometryPoint',
                    geometry: JSON.stringify({
                        x: -92.017437,
                        y: 30.224518,
                        spatialReference: {
                            wkid: 4326
                        }
                    }),
                    spatialRel: 'esriSpatialRelContains',
                    distance: 100,
                    outFields: '*',
                    returnGeometry: true,
                    units: 'esriSRUnit_Meter'
                };
                
                featureClient.queryAsync(queryParams).then((data)=>{
                    console.log(data);
                }); */
                
                //async stuff here
                return new Promise((resolve, reject)=>{
                    //do whatever async
                    
                    resolve({
                        'default': function(bot, message){
                            
                            bot.reply(message, 'Data message');
                        }
                    });
                })
            }
        };
    };
   
})();