(() => {
    /**
     * This file takes care of loading the configuration for 
     * the beaux bot server
     */
    const path = require('path');
    const nconf = require('nconf');
    const opts  = require('./configuration')();

    module.exports = function(){
        //1. Load command line and env vars
        nconf.argv().env();
        //2. Extend Custom JSON Config
        nconf.file(path.join(__dirname,'custom.config.json'));
        //3. Static config (Lowest precedence)
        nconf.defaults(opts);
        
        console.log('Displaying running server config below:');
        console.log(nconf.get());
        return nconf;
    };
})();


