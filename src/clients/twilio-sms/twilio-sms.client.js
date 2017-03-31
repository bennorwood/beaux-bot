/**
 * Twilio client that will manage all twilio bot related events.
 *
 * To properly run client update the following environment variables:
 * 	SET TWILIO_CLIENT_ACCESS_TOKEN <your access token>
 * 	SET TWILIO_CLIENT_SID <your account sid>
 * 	SET TWILIO_NUMBER <your twilio number>
 * 
 */
(() => {
    
    const path      = require('path');
    const BotKit    = require('botkit-sms');
    const express   = require('express');
    const nconf     = require('nconf');
    const blue      = require('chalk').blue;
    const red       = require('chalk').red;
    const twilio    = require('twilio');
    const beauxUtil = require( path.join( nconf.get('paths:modulesDir'), 'beaux-utilities', 'beaux-utilities') );
    
    // string reference constants
    const CLIENT_NAME                     = nconf.get('clients:twilio-sms:name');
    const TWILIO_CLIENT_SID_NAME          = 'TWILIO_CLIENT_SID';
    const TWILIO_CLIENT_ACCESS_TOKEN_NAME = 'TWILIO_CLIENT_ACCESS_TOKEN';
    const TWILIO_NUMBER_NAME              = 'TWILIO_NUMBER';
    
    //If server in development mode add environment variable prefix to run separate instance of a twilio bot
    const twilioOpts = {
        'account_sid': nconf.get( nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), TWILIO_CLIENT_SID_NAME) ),
        'auth_token': nconf.get( nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), TWILIO_CLIENT_ACCESS_TOKEN_NAME) ),
        'twilio_number': nconf.get( nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), TWILIO_NUMBER_NAME) )
    };
    
    const apiaiManager = require( path.join( nconf.get('paths:modulesDir'), 'apiai', 'apiai.manager') );
    const responseManager = require( path.join( nconf.get('paths:modulesDir'), 'domain-requests', 'domain-request.manager') );
    
    module.exports = function(opts){
        let appConfigs = opts.appConfig;
        let twilioBotController = null,
            twilioBot = null;
        
        return {
            initialize: function(){
                if(nconf.get('clients:twilio-sms:enabled') === true){
                    if( !twilioOpts.account_sid || !twilioOpts.auth_token || !twilioOpts.twilio_number ){
                        beauxUtil.logUninitializedVar(TWILIO_CLIENT_SID_NAME, CLIENT_NAME);
                        beauxUtil.logUninitializedVar(TWILIO_CLIENT_ACCESS_TOKEN_NAME, CLIENT_NAME);
                        beauxUtil.logUninitializedVar(TWILIO_NUMBER_NAME, CLIENT_NAME);
                    } else {
                        //assuming this all happens synchronously :/
                        console.log(blue('Initializing twilio bot client connection...'));
                        twilioBotController = BotKit(twilioOpts);
                        twilioBot = twilioBotController.spawn({});
                        
                        this.initializeEventHandlers();
                        
                        appConfigs.forEach((appConfig) => {
                            appConfig.app.use(opts.webhookEndpoint, this.setupWebHook(twilioBot));
                        });
                    }
                }
            },
            initializeEventHandlers: function(){
                if(opts.botEvents){
                    //Need to add event handler method for all events
                    opts.botEvents.forEach(function(event){
                        twilioBotController.on(event, function(bot, message){                            
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
                    console.log(red('No event handlers specified for twilio bot...'));
                }
            },
            setupWebHook: function(bot){
                let router = express.Router();
                router.post('/', (req, res) => {
                    twilioBotController.log('=> Got a message hook');

                    let message = {
                        text: req.body.Body,
                        from: req.body.From,
                        to: req.body.To,
                        user: req.body.From,
                        channel: req.body.From,
                        timestamp: Date.now(),
                        sid: req.body.MessageSid,
                        NumMedia: req.body.NumMedia,
                        MediaUrl0: req.body.MediaUrl0,
                        MediaUrl1: req.body.MediaUrl1,
                        MediaUrl2: req.body.MediaUrl2,
                        MediaUrl3: req.body.MediaUrl3,
                        MediaUrl4: req.body.MediaUrl4,
                        MediaUrl5: req.body.MediaUrl5,
                        MediaUrl6: req.body.MediaUrl6,
                        MediaUrl7: req.body.MediaUrl7,
                        MediaUrl9: req.body.MediaUrl9,
                        MediaUrl10: req.body.MediaUrl10
                    };

                    twilioBotController.receiveMessage(bot, message);
                        
                    // Send empty TwiML response to Twilio
                    let twiml = new twilio.TwimlResponse();
                    res.type('text/xml');
                    res.send(twiml.toString());
                });
                
                return router;
            }
        };
    };
})();