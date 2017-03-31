(() =>{
    const http = require('http');
    const path = require('path');
    
    const bodyParser = require('body-parser');
    const cyan    = require('chalk').cyan;
    const red     = require('chalk').red;
    const express = require('express');
    const helmet  = require('helmet');
    const morgan  = require('morgan');
    const Q       = require('q');
    
    const initMiddleware = function(entityType, entities, entityDir, appConfig){
        let promises = [],
            entityMetadata = null;
        for(let entityKey in entities) {
            console.log('Initializing '+entityType+': ' + entityKey);
            
            entityMetadata = entities[entityKey];
            entityMetadata.opts.appConfig = appConfig;
            
            if(entityMetadata.enabled === true) {
                let entityModule = require(path.join(entityDir, entityMetadata.path));
                
                if(typeof entityModule === 'function'){
                    promises.push(Q.when(entityModule(entityMetadata.opts).initialize()));
                } else {
                    promises.push(Q.when(entityModule.initialize(entityMetadata.opts)));
                }
                
            } else {
                console.log('Skipping disabled '+entityType+' for ' + entityKey);
            }
        }
        
        return promises;
    };
    
    module.exports = () => {
        const nconf = require('nconf');
        
        return {
            getMode: function(){
                return nconf.get('mode');
            },
            initialize: function(){
                let isHttpEnabled = true;
                
                let appConfigs = [
                    {
                        enabled: isHttpEnabled,
                        name: 'http',
                        app: express(),
                        server: http,
                        port: nconf.get('port')
                    }
                ];
                
                appConfigs.forEach((appConfig) => {
                    if(appConfig.enabled === true) {
                        this.initLogging(appConfig.app);//should happen first.
                        this.setupHelmet(appConfig.app);
                        this.setupBodyparser(appConfig.app);
                        this.initRouter(appConfig.app, nconf.get('routers'), nconf.get('paths:routeDir'));
                        this.initStaticFiles(appConfig.app, nconf.get('staticDirs'));
                }
            });
                
                let asyncInitializations = [];
                
                asyncInitializations.push(this.initModules(nconf.get('modules'), nconf.get('paths:modulesDir')));
                asyncInitializations.push(this.initClients(nconf.get('clients'), nconf.get('paths:clientsDir'), appConfigs));
                
                Q.all(asyncInitializations).then(() =>{
                    appConfigs.forEach((appConfig) => {
                        this.bootServer(appConfig);
                    });
                });				
                
                return appConfigs;
            },
            /**
             * Clients will need appConfig to configure webhooks (Express routes) that the client app will send requests to
             */
            initClients: function(clients, clientDir, appConfig) {
                return initMiddleware('client', clients, clientDir, appConfig);
            },
            initModules: function(modules, modulesDir){
                return initMiddleware('module', modules, modulesDir);
            },
            /**
            * Registers the express routers with the app.
            */
            initRouter: function(app, routers, routesDir) {
                /**
                 * Set all routes to allow AJAX requests. This is necessary so that the beaux-bot can request
                 * resources on servers that are not itself.
                 */
                app.use((req, res, next) => {
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, x-auth-token, Content-Type, Accept');
                    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                    next();
                });
                
                let routeMetadata = null;
                for(let routeKey in routers) {
                    console.log('Creating router for path: ' + routeKey);
                    
                    routeMetadata = routers[routeKey];
                    if(routeMetadata.enabled === true) {
                        console.log(path.join(routesDir, routeMetadata.router));
                        routeMetadata.opts.app = app;
                        app.use(routeKey, require(path.join(routesDir, routeMetadata.router))(routeMetadata.opts).configure());
                    } else {
                        console.log('Skipping disabled router for ' + routeKey);
                    }
                }
            },
            initLogging: function(app){
                let format = nconf.get('logging:'+this.getMode()+':format') || 'tiny';
                app.use(morgan(format));
            }, 
            initTunnel: function(){
                console.log(cyan('Establishing Tunnel Connection...'));
                /**
                 * So we can use webhooks, we need to open up this port to the world.
                 */
                if(this.getMode().toUpperCase() === 'DEVELOPMENT'){
                    return new Promise((resolve, reject) => {
                        const localtunnel = require('localtunnel');
                        
                        localtunnel(nconf.get('port'), nconf.get('tunnelOpts'), function(err, tunnel) {
                            if (err) reject(err);
                            
                            nconf.set('tunnelOpts:tunnel', {
                                tunnel: tunnel,
                                close: function(){
                                    console.log('Shutting down tunnel connection.');
                                    Q.when(tunnel.close());
                                }
                            });
                            
                            resolve(nconf.get('tunnelOpts:tunnel'));
                        })
                        .on('close', function() {
                            console.log('*LocalTunnel: Tunnel successfully closed.');
                        })
                        .on('error', function(err) {
                            console.log(red('*LocalTunnel: '+err));
                        });
                    });
                } else {
                    return Q.when(null);
                }
                
            },
            initStaticFiles: function(app, staticDirs){

                //Configure express to serve static files such as js files, css, images.
                for(let i = 0; i < staticDirs.length; i++) {
                    console.log('Serving static dir: ' + staticDirs[i]);
                    app.use(express.static(staticDirs[i]));
                }
                app.use(express.static(nconf.get('paths:appDir')));
            },
           /**
            * Configure app to use body-parser module.
            * This will let us get the data from a POST.
            */
            setupBodyparser: function(app) {
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use(bodyParser.json());
            },
            setupHelmet: function(app) {
                app.use(helmet());

                app.get('/', function (req, res) {
                    res.sendFile(path.join(nconf.get('paths:appDir'), 'home.html'));
                });
            },
            bootServer: function(appConfig){
                let allServersListening = [];
                const shutdownServer = function(){
                    const tunnelInfo = nconf.get('tunnelOpts:tunnel');
                    let promises = [];
                    
                    if(tunnelInfo && tunnelInfo.close){
                        promises.push(nconf.get('tunnelOpts:tunnel').close());
                    }
                    
                    Q.all(promises).then(()=>{
                        process.exit(0);
                    });
                };
                
                if(appConfig.enabled === true) {
                    appConfig.isListening = Q.defer();
                    allServersListening.push(appConfig.isListening.promise);
                    
                    if(appConfig.serverOptions) {
                        appConfig.runtimeServer = appConfig.server.createServer(appConfig.serverOptions, appConfig.app);
                    } else {
                        appConfig.runtimeServer = appConfig.server.createServer(appConfig.app);
                    }
                    appConfig.runtimeServer.listen(appConfig.port, null, null, () => {
                        console.log('Listening on', appConfig.name, 'port', appConfig.port);
                        appConfig.isListening.resolve(appConfig);
                    });
                    
                    Q.when(allServersListening).then(()=>{
                        this.initTunnel();
                    });
                }
                
                /**
                 * TODO: Might be a safer way to disconnect all the clients/modules first before shutting down the process.
                 */
                // listen for TERM signal .e.g. kill 
                process.on('SIGTERM', shutdownServer);
                // listen for INT signal e.g. Ctrl-C
                process.on('SIGINT', shutdownServer);  
                
                process.on('uncaughtException', function(err) {
                    console.log('UncaughtException:');
                    console.log(err);
                });
                
                console.log(cyan(nconf.get('appName') + ': Great Success :D App initialized in ' + this.getMode().toUpperCase() + ' mode.'));
            }
        };
    };
})();