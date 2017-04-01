(() => {
    const path = require('path');
    /**
     * This is the main config file for the app.
     */
    module.exports = function(){
        return {
            botName: 'Beaux Bot',
            appName: 'beaux-bot',
            port: 7000,
            mode: 'development',
            staticDirs: [
                path.resolve(__dirname, '..', 'public')
            ],
            tunnelOpts: {
                subdomain: 'beauxbot'
            },
            /**
             * The purpose of this method is to resolve environment variable tokens if 
             * running server in development mode. You can prefix keys 'DEV_' to use personal version of service. For example,
             * if you have an api.ai agent and a client key, you can store the token in an environment variable named 'DEV_APIAI_CLIENT_ACCESS_TOKEN'
             * while still maintaining a 'APIAI_CLIENT_ACCESS_TOKEN' for 'production' mode.
             */
            resolveTokenKey: function(nconf, mode, base) {
                const devTokenPrefix = 'DEV_';
                
                if(mode === 'development' && nconf.get(devTokenPrefix + base)){
                    return devTokenPrefix + base;
                } else {
                    return base;
                }
            },
            logging: {
                /**
                 * Using morgan module for logging
                 * https://github.com/expressjs/morgan#predefined-formats
                 */
                
                development: {
                    format: 'dev'
                },
                production: {
                    format: 'combined'
                }
            },
            paths: {
                root: path.resolve(__dirname, '..'),
                bootDir: path.resolve(__dirname, '..', 'init'),
                configDir: path.resolve(__dirname, '..', 'config'),
                clientsDir: path.resolve(__dirname, '..', 'clients'),
                domainsDir: path.resolve(__dirname, '..', 'domains'),
                modulesDir: path.resolve(__dirname, '..', 'modules'),
                routeDir: path.resolve(__dirname, '..', 'routes'),
                appDir: path.resolve(__dirname, '..','..','public','app')
            },
            /**
             * Routers are Express based REST endpoints: https://expressjs.com/en/4x/api.html#router
             * Routers are initialized in express-init.js ~L-59
             */
            routers: {
                '/hello-world': {
                    enabled: true,
                    router: 'hello-world/hello-world-router',
                    opts: {
                        controllerOpts: {
                            debug: true
                        }
                    }
                }
            },
            /**
             * Clients are the user interface to this bot. Slack can be used for ease of development.
             * Clients are initialized in express-init.js ~L-66
             */
            clients: {
                /**
                 * Slack client that will manage all slack bot related events.
                 *
                 * To properly run client update the following environment variable:
                 * 	SET SLACKBOT_CLIENT_ACCESS_TOKEN <your access token>
                 */
                'slack': {
                    name: 'slack',
                    enabled: true,
                    path: 'slack/slack.client',
                    opts: {
                        botEvents: ['direct_message', 'direct_mention'] //Development ['message_received']
                    }
                },
                /**
                 * Twilio SMS client that will manage all Twilio SMS bot related events.
                 *
                 * To properly run client update the following environment variable:
                 * 	SET TWILIO_CLIENT_SID <your account sid>
                 * 	SET TWILIO_CLIENT_ACCESS_TOKEN <your access token>
                 * 	SET TWILIO_NUMBER <your twilio number>
                 */
                'twilio-sms': {
                    name: 'twilio-sms',
                    enabled: true,
                    path: 'twilio-sms/twilio-sms.client',
                    opts: {
                        botEvents: ['message_received'],
                        webhookEndpoint: '/sms/receive'
                    }
                },
                /**
                 * Facebook Messenger client that will manage all Facebook Messenger bot related events.
                 *
                 * To properly run client update the following environment variable:
                 * 	SET FACEBOOK_MESSENGER_ACCESS_TOKEN_FILE <absolute filepath to file containing access token>
                 * 	SET FACEBOOK_MESSENGER_VERIFY_TOKEN_FILE <absolute filepath to file containing verify token>
                 */
                'facebook-messenger': {
                    name: 'facebook-messenger',
                    enabled: true,
                    path: 'facebook-messenger/facebook-messenger.client',
                    opts: {
                        botEvents: ['message_received'],
                        webhookEndpoint: '/messenger/receive'
                    }
                }
            },
            /**
             * Domains are api.ai specific modules that will handle processing/resolving 
             * any domain specific query.
             */
            domains: {
                /**
                 * This domain should be capable of resolving a user's query regarding weather.
                 */
                'lafayette-art': {
                    name: 'lafayette-art',
                    enabled: true,
                    path: 'lafayette-art/art',
                    actions: ['lafayette-art'],
                    opts: {
                        arcGisParams:{
                            url:'https://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/'
                        },
                        distance: 300
                    }
                },
                'lafayette-events': {
                    name: 'lafayette-events',
                    enabled: true,
                    path: 'lafayette-events/events',
                    actions: ['lafayette-events'],
                    opts: {
                        
                    }
                },
                'lafayette-incidents': {
                    name: 'lafayette-incidents',
                    enabled: true,
                    path: 'lafayette-incidents/incidents',
                    actions: ['lafayette-incidents'],
                    opts: {
                        arcGisParams: {
                            url: 'https://services.arcgis.com/fOr4AY8t0ujnJsua/arcgis/rest/services/CV_CAD_CMV_DSH/FeatureServer/0/'
                        },
                        distance: 150
                    }
                }
            },
            /**
             * Modules are initialized in express-init.js ~L-65
             */
            modules: {
                /**
                 * The api.ai module is used to 'codify' natural language (NLP). We can use api.ai to define/determine intents
                 * and trigger actions.
                 * To use apiai module update the following env vars:
                 * 	SET APIAI_CLIENT_ACCESS_TOKEN <your access token>
                 */
                'apiai': {
                    enabled: true,
                    REPLEnabled: false,
                    path: 'apiai/apiai.manager',
                    opts: {
                        clientOpts: {
                            secure: false
                        },
                        sessionOpts: {
                            sessionId: 'beaux-bot-'+Date.now()
                        }
                    }
                },
                /**
                 * Domain request manager (Will handle dispatching domain requests to modules and packaging responses to client apps).
                 * This module is kind of like the mouthpiece, in that it determines what domain should handle the message being processed.
                 */
                'domainRequestManager': {
                    enabled: true,
                    path: 'domain-requests/domain-request.manager',
                    opts: {
                        
                    }
                },
                /**
                 * Utility modules 
                 */
                'beaux-utilities': {
                    enabled: true,
                    path: 'beaux-utilities/beaux-utilities',
                    opts: {}
                },
                /**
                 * Utility modules 
                 */
                'geo-utils': {
                    enabled: true,
                    path: 'geo-utils/geo-utils',
                    opts: {
                        geocoderTokenName: 'GOOGLE_MAPS_GEOCODER_ACCESS_TOKEN',
                        nodeGeoCoderOpts: {
                            provider: 'google',
                            // Optional depending on the providers 
                            httpAdapter: 'http', // Default 
                            apiKey: null, // for Mapquest, OpenCage, Google Premier 
                            formatter: 'json'
                        }
                    }
                }
            }
        };
    };
})();

