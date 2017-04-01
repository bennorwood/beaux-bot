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
            let params = {
                url: 'https://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/'
            };
            
            this.getFeatureServiceClient(params).then((featureClient)=>{
                /* const queryParams = {
                    f: 'json',
                    geometryType: 'esriGeometryPoint',
                    geometry: {
                        x: -92.017437,
                        y: 30.224518,
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    spatialRel: 'esriSpatialRelContains',
                    distance: 100,
                    returnGeometry: true,
                    units: 'esriSRUnit_Meter'
                }; */
                
                const queryParams = {
                    returnGeometry: true,
                    where: '1=1',
                    outSR: '3857',
                    outFields: '*'
                };
                
                featureClient.query(queryParams, function(err, data){
                    if(err) console.log(err);
                    
                    console.log(data);
                    console.log(data.features[0]);
                });
                
                /* featureClient.queryAsync(queryParams).then((data)=>{
                    console.log(data);
                }); */
                
                const http = require('http');
                
                http.get('http://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/query?where=1%3D1&f=json', function(response) {
                    // Continuously update stream with data
                    let body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    
                    response.on('end', function() {

                        // Data reception is done, do whatever with it!
                        let parsed = JSON.parse(body);
                        //console.log(body);
                        console.log(parsed);
                        console.log(parsed.features[0]);
                    });
                });
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
    
    lib.initialize();
    module.exports = lib;
})();