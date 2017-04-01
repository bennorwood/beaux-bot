/**
 * Api.ai bot manager.
 * Single source to make requests to bot service.
 *
 * To use apiai module update the following env vars:
 * 	SET APIAI_CLIENT_ACCESS_TOKEN <your access token>
 */
(() =>{
    const nconf = require('nconf');
    const apiai = require('apiai');
    const blue  = require('chalk').blue;
    const red   = require('chalk').red;
    //If server in development mode add environment variable prefix to connect to separate instance of a api.ai NLP service.
    const tokenName = nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), 'APIAI_CLIENT_ACCESS_TOKEN');
    
    let botClient = null;
    let isInitialized = false;
    let opts          = null;
    
    /**
     * TODO: "This may be moved to a common utils file...
     */
    const acceptUnAuthTLS = () => {
        if(nconf.get('mode') === 'development'){
            /**
             * TODO: Sigh...getting around self signed certs for POC...FML
             * Concise Explanation: http://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired#answer-29397100
             */
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
    };
    
    const testBotClient = () => {
        
        return textRequest({text: 'hello'}).then(()=>{
            console.log('Test request completed successfully.');
        }, (error) => {
            console.log(error);
        });
    };
    
    const textRequest = (payload) => {
        return fireRequest('textRequest', [payload.text, opts.sessionOpts]);
    };
    
    /**
     * Hopefully this method is generic enough to meet most needs.
     */
    const fireRequest = (methodName, arguments) => {
        if(isInitialized){
            return new Promise((resolve, reject) => {
                acceptUnAuthTLS();
                
                let request = botClient[methodName].apply(botClient, arguments);
                
                request.on('response', function(response) {
                    resolve(response);
                });
                
                request.on('error', function(error) {
                    reject(error);
                });
                
                request.end();
            });
        } else {
            throw new Error('Module did not initialize properly.', 'apiai.manager.js');
        }
        
    };
    
    const botREPL = () => {
        if(nconf.get('mode') === 'development' && nconf.get('modules:apiai:REPLEnabled') === true){
            console.log(blue('* Starting '+nconf.get('botName')+' REPL in dev mode...'));
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            
            const killREPL = () => {
                console.log('Let\'s just stop the server in this case for now.');
                process.exit();
            };
            
            const killTriggers = ['q', 'quit', 'exit'];
            const cyan = require('chalk').cyan;

            process.stdin.on('data', function (text) {
                const trimmedText = text.replace(/^\s+|\s+$/g, '');
                fireRequest('textRequest', [trimmedText, opts.sessionOpts]).then((response)=>{
                    console.log(cyan(nconf.get('botName')+' says: ' + response.result.fulfillment.speech));
                }, console.log);
                
                if (killTriggers.indexOf(trimmedText) !== -1) {
                    killREPL();
                }
            });
        }
    };
    
    /**
     * This method is intended to be used as middleware for botkit clients.
     * Since we are using api.ai as a NLP resource we want to add its processing capabilities 
     * as a incoming message filter by making a request to the service before we attempt to prepare a response to the client.
     */
    const processUserMessage = (bot, message) => {
        const userSessionOpts = Object.assign({}, opts.sessionOpts, {sessionId: opts.sessionOpts.sessionId+message.user});
        if(message.text){
            return fireRequest('textRequest', [message.text, userSessionOpts]).then((apiaiResp)=>{
                message.apiai = apiaiResp;
                //console.log(apiaiResp);
                return message;
            },(error) =>{
                console.log(red('APIAI: ',error));
                console.log(error);
                return error;
            });
        }
        
    };
    
    module.exports = {
        initialize: (instanceOpts) => {
            opts = instanceOpts;
            
            if(nconf.get('modules:apiai:enabled') === true){
                if(!nconf.get(tokenName)){
                    console.log(red('Evironment variable not set: \'<APIAI_CLIENT_ACCESS_TOKEN>\', cannot initialize module.'));
                } else {
                    console.log(blue('Initializing api.ai bot connection...'));
                    botClient = apiai(nconf.get(tokenName));
                    isInitialized = true;
                    return testBotClient().then(botREPL);
                }
            }
        },
        getSessionOpts: () => {
            const immutableOpts = opts.sessionOpts;
            return immutableOpts;
        },
        textRequest: textRequest,
        fireRequest: fireRequest,
        processUserMessage: processUserMessage
    };
    
})();