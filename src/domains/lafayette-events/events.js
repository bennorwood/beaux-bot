(()=>{
    const path         = require('path');
    const mockEvents   = require(path.join(__dirname, 'mockEvents'));
  
    module.exports = function(){
        
        return {
            initialize: function(){/*no-op*/},
            prepareResponse: function(message){               
                //async stuff here
                return new Promise((resolve) => {
                    //do whatever async
                    const filterMethod = function(event){
                        return event.type.indexOf(message.apiai.result.parameters.events) !== -1;
                    };
                        
                    let resultSet = mockEvents.events.filter(filterMethod);
                    
                    if(message.apiai.result.parameters.events && resultSet.length > 0){
                        
                        let responseString = [];
                        resultSet.forEach(function(event){
                            responseString.push(` ${event.name} (${event.startDate}): ${event.location} ${event.details}`);
                        });
                        resolve({
                            'default': function(bot, message){
                                bot.reply(message, ['Here are some events you might be interested in: ', responseString].join(''));
                            }
                        });
                    } else {
                        resolve({
                            'default': function(bot, message){
                                bot.reply(message, message.apiai.result.fulfillment.speech);
                            }
                        });
                    }
                    
                });
            }
        };
    };
   
})();