(()=>{
    const path = require('path');
    
    const nconf    = require('nconf');
    const GeoUtils = require(path.join(nconf.get('paths:modulesDir'), 'geo-utils', 'geo-utils'));
    
    const FAIL_MESSAGE = 'I\'m sorry! I can\'t find any art right now. Please ask me again later!';
    
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
                                let responseString = [];
                                data.features.forEach(function(feature){
                                    
                                    responseString.push(` ${feature.attributes.Venue}: ${feature.attributes.Street_Add} ${feature.attributes.ZipCode} ${feature.attributes.Descriptio}`);
                                });
                                responseString = responseString.join(' Also, check out ');
                                
                                resolve({
                                    'default': function(bot, message){
                                        bot.reply(message, ['Here are some places you might be interested in: ', responseString].join(''));
                                    }
                                });
                            });
                        } else {
                            resolve({
                                'default': function(bot, message){
                                    bot.reply(message, FAIL_MESSAGE);
                                }
                            });
                        }
                        
                    }, console.log);
                });
            }
        };
    };
   
})();