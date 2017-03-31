/**
 * Facebook Messenger client that will manage all messenger bot related events.
 *
 * To properly run client update the following environment variables:
 * 	SET FACEBOOK_MESSENGER_ACCESS_TOKEN_FILE <absolute filepath to file containing access token>
 * 	SET FACEBOOK_MESSENGER_VERIFY_TOKEN_FILE <absolute filepath to file containing verify token>
 */
(() => {
       
    const path      = require('path');
    const BotKit    = require('botkit');
    const express   = require('express');
    const nconf     = require('nconf');
    const red       = require('chalk').red;
    const beauxUtil = require( path.join( nconf.get('paths:modulesDir'), 'beaux-utilities', 'beaux-utilities') );
    
    // string reference constants
    const CLIENT_NAME       = nconf.get('clients:facebook-messenger:name');
    const ACCESS_TOKEN_NAME = 'FACEBOOK_MESSENGER_ACCESS_TOKEN_FILE';
    const VERIFY_TOKEN_NAME = 'FACEBOOK_MESSENGER_VERIFY_TOKEN_FILE';
    
    let messengerOpts = {
        access_token: null,
        verify_token: null
    };
    
    beauxUtil.loadTokenFromFile(ACCESS_TOKEN_NAME, CLIENT_NAME).then((data) => { messengerOpts.access_token = data; });
    beauxUtil.loadTokenFromFile(VERIFY_TOKEN_NAME, CLIENT_NAME).then((data) => { messengerOpts.verify_token = data; });
    
    const apiaiManager = require( path.join( nconf.get('paths:modulesDir'), 'apiai', 'apiai.manager') );
    const responseManager = require( path.join( nconf.get('paths:modulesDir'), 'domain-requests', 'domain-request.manager') );
    
    module.exports = function(opts){
        
        let appConfigs = opts.appConfig;
        let facebookBotController = null,
            facebookBot = null;
        
        return {
            initialize: function() {
                if(nconf.get('clients:facebook-messenger:enabled') === true) {
                    //assuming this all happens synchronously
                    facebookBotController = BotKit.facebookbot(messengerOpts);
                    facebookBot = facebookBotController.spawn({});
                    
                    this.initializeEventHandlers();
                    
                    appConfigs.forEach((appConfig) => {
                        appConfig.app.use(opts.webhookEndpoint, this.setupWebHook(facebookBot));
                    });
                }
            },
            initializeEventHandlers: function(){
                if(opts.botEvents){
                    // Need to add event handler method for all events
                    opts.botEvents.forEach(function(event){
                        facebookBotController.on(event, function(bot, message){                            
                            apiaiManager.processUserMessage(bot, message).then(()=>{
                                console.log(message);
                            }, console.log)
                            .then(()=>{
                                return responseManager.responseDigest(message).then((responseMethods)=> {
                                    responseManager.respond(CLIENT_NAME, responseMethods, bot, message);
                                }); 
                            });
                        });
                    });
                    
                } else {
                    console.log(red('No event handlers specified for facebook messenger bot...'));
                }
            },
            setupWebHook: function(){
                let router = express.Router();
                
                router.get('/', (req, res) => {
                    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === messengerOpts.verify_token) {
                        console.log('Validating webhook');
                        res.status(200).send(req.query['hub.challenge']);
                    } else {
                        console.error('Failed validation. Make sure the validation tokens match.');
                        res.sendStatus(403);       
                    }  
                });
                
                router.post('/', function (req, res) {
                    // TODO: verify if Facebook handles message failures and
                    // things of that nature 
                    //
                    // For now assume they do and send back a 200 status, if
                    // not done within 20 seconds the request will time out and
                    // Facebook will keep trying to resend
                    res.sendStatus(200);
    
                    facebookBotController.handleWebhookPayload(req, res, facebookBot);
                });
                
                return router;
            }
        };
    };
})();