/**
 * Geo Utils used through out the project.
 */
(() => {
    
    const nconf = require('nconf');
    const BlueBird = require('bluebird');
    
    const Geoservices = require('geoservices');
    const client = new Geoservices();
    BlueBird.promisifyAll(client.geocode);
    
    let lib = {
        initialize: function(opts) {/*no-op*/
            
            this.getFeatureServiceClient(params).then((featureClient)=>{
                /**
                 * Leaving sample query setup below.
                 * https://github.com/Esri/geoservices-js/blob/master/docs/FeatureServices.md
                 */
                 
                /* 
                let params = {
                    url: 'https://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/'
                };
                const queryParams = {
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
                }; */
                
                /* featureClient.queryAsync(queryParams).then((data)=>{
                    console.log(data);
                }); */
                
            });
        },
        ArcGISClient: client,
        getFeatureServiceClient: function(params){
            return new Promise( (resolve, reject) => {
               let featureServiceClient = client.featureservice( params , function (err, result) {
                    if (err) {
                        console.error("GEO-UTILS ERROR: " + err);
                        reject(err);
                    } else {
                        //promisify featureServiceClient
                        BlueBird.promisifyAll(featureServiceClient);
                        console.log("Metadata: ");
                        console.log(result);
                        resolve(featureServiceClient);
                    }
                });
            });
        }
    };
    
    module.exports = lib;
})();