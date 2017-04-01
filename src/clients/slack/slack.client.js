/**
 * Slack client that will manage all slack bot related events.
 *
 * To properly run client update the following environment variable:
 * 	SET SLACKBOT_CLIENT_ACCESS_TOKEN <your access token>
 *
 */
(() => {
    const path = require('path');

    const BotKit = require('botkit');
    const nconf  = require('nconf');
    const blue    = require('chalk').blue;
    const red    = require('chalk').red;
    //If server in development mode add environment variable prefix to run separate instance of a slackbot
    const tokenName = nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), 'SLACKBOT_CLIENT_ACCESS_TOKEN');

    const apiaiManager = require( path.join( nconf.get('paths:modulesDir'), 'apiai', 'apiai.manager') );
    const responseManager = require( path.join( nconf.get('paths:modulesDir'), 'domain-requests', 'domain-request.manager') );

    const CLIENT_NAME = nconf.get('clients:slack:name');

    module.exports = function(opts){
        let slackBotController = null;

        return {
            initialize: function(){
                if(nconf.get('clients:slack:enabled') === true){
                    if(!nconf.get(tokenName)){
                        console.log(red('Evironment variable not set: \'<'+tokenName+'>\', cannot initialize slack client.'));
                    } else {
                        //assuming this all happens synchronously :/
                        console.log(blue('Initializing slack bot client connection...'));
                        slackBotController = BotKit.slackbot(opts.controllerOpts);
                        this.initializeEventHandlers();

                        slackBotController.spawn({
                            token: nconf.get(tokenName)
                        }).startRTM();
                    }
                }
            },
            initializeEventHandlers: function(){
                if(opts.botEvents){
                    //Need to add event handler method for all events
                    opts.botEvents.forEach(function(event){
                        slackBotController.on(event, function(bot, message){
                            apiaiManager.processUserMessage(bot, message).then(()=>{
                            }, console.log)
                            .then(()=>{
                                return responseManager.responseDigest(message).then((responseMethods)=> {
                                    responseManager.respond(CLIENT_NAME, responseMethods, bot, message);
                                });
                            });
                        });
                    });

                } else {
                    console.log(red('No event handlers specified for slack bot...'));
                }
            }
        };
    };
})();
