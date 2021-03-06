(()=>{
    const path = require('path');
    
    const nconf    = require('nconf');
    const GeoUtils = require(path.join(nconf.get('paths:modulesDir'), 'geo-utils', 'geo-utils'));
    
    let featureClient = null;
  
    module.exports = function(opts){
        
        return {
            initialize: function(){
                return GeoUtils.getFeatureServiceClient(opts.arcGisParams).then((client) => {
                    featureClient = client;
                });
            },
            prepareResponse: function(message){               
                //async stuff here
                return new Promise((resolve)=>{
                    //do whatever async
                    
                    GeoUtils.GeoCoderClient.geocode({address: message.apiai.result.parameters.address}).then(function(results){
                        let location = GeoUtils.getLafayetteLocationItem(results);
                        if(location){
                            const queryParams = {
                                geometryType: 'esriGeometryPoint',
                                geometry: JSON.stringify({
                                    x: location.longitude,
                                    y: location.latitude,
                                    spatialReference: {
                                        wkid: 4326
                                    }
                                }),
                                spatialRel: 'esriSpatialRelContains',
                                distance: opts.distance,
                                outFields: '*',
                                returnGeometry: true,
                                units: 'esriSRUnit_Meter'
                            };
                            
                            featureClient.queryAsync(queryParams).then((data)=>{
                                resolve({
                                    'default': function(bot, message){
                                        bot.reply(message, `It looks like ${data.features.length} reported incidents have happened near you.`);
                                    }
                                });
                            });
                        } else {
                            resolve({
                                'default': function(bot, message){
                                    bot.reply(message, message.apiai.result.fulfillment.speech);
                                }
                            });
                        }
                        
                    }, console.log);
                });
            }
        };
    };
   
})();