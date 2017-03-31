/**
 * Domain Request manager.
 * The mouthpiece of the bot.
 *
 * This works similar to request filters logic. There's a list of 'action'
 * managers that will satisfy 
 */
(() =>{
    const path   = require('path');
    
    const nconf = require('nconf');
    const blue  = require('chalk').blue;
    const Q     = require('q');
    
    let initializedDomains  = {};
    const DEFAULT_RESPONSE_MTHD_NM = 'default';
    let baseResponseObject = {};
    
    baseResponseObject[DEFAULT_RESPONSE_MTHD_NM] = function(bot, message, cb){
        return Q.when(bot.reply(message, message.apiai.result.fulfillment.speech, cb));
    };
    
    const mapActionToDomain = (domain) => {
        //require domain, run initializer, store reference in initializedDomains
        let domainModule = require(path.join(nconf.get('paths:domainDir'), domain.path))(domain.opts).initialize();
        
        domain.actions.forEach((actionType) => {
            initializedDomains[actionType] = domainModule;
        });
    };
    
    const responseDigest = (message) => {
        //grab action from message object, if no domain exists for action use default api.ai response
        if(initializedDomains[message.apiai.result.action]){
            return Q.when(initializedDomains[message.apiai.result.action].prepareResponse(message)).then((responseMths)=>{
                return Object.assign({}, baseResponseObject, responseMths);
            });
        } else {
            return Q.when(baseResponseObject);
        }
    };
    
    const respond = function(clientName, methods, bot, message, cb){
        if(methods[clientName]){
            return methods[clientName](bot, message);
        } else {
            methods[DEFAULT_RESPONSE_MTHD_NM](bot, message, cb);
        }
    };
    
    module.exports = {
        initialize: () => {
            
            if(nconf.get('modules:domainRequestManager:enabled') === true){
                console.log(blue('Initializing domain request manager.'));
                
                let domain = null;
                for(domain in nconf.get('domains')){
                    if(domain.enabled === true){
                        mapActionToDomain(domain);
                    }
                }
                    
            }
        },
        responseDigest: responseDigest,
        respond: respond
    };
    
})();