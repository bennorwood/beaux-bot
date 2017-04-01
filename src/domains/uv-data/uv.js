(()=>{
    const nconf   = require('nconf');
    const path = require('path');
    const uvUtil  = require( path.join( nconf.get('paths:modulesDir'), 'uv-hourly', 'uv-hourly'));

    const scoreToResponse = function(score){
        switch(score){
        case 0:
        case 1:
        case 2:
            return 'You should be fine without sun screen!';
        case 3:
        case 4:
        case 5:
            return 'You don\'t need it if you\'re mostly inside.';
        case 6:
        case 7:
            return 'You should use sun screen if you\'re playing outside today.';
        default:
            return 'You definitely need sun screen!';
        }
    };

    module.exports = function(){

        return {
            initialize: function(){
                return ;
            },
            prepareResponse: function(){

                //async stuff here
                return new Promise((resolve)=>{
                    //do whatever async
                    resolve({
                        default: function(bot, message){
                            uvUtil.getLatestUVScore().then((score) => {
                                bot.reply(message, 'The current UV score is ' + score + '. ' + scoreToResponse(score));
                            });
                        }
                    });
                });
            }
        };
    };

})();
