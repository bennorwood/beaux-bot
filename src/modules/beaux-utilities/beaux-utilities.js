/**
 * Utilities used through out the beaux-bot project.
 */
(() => {
    
    const nconf = require('nconf');
    const fs    = require('fs');
    const red   = require('chalk').red;
    
    module.exports = {
        initialize: function() {},
        loadTokenFromFile: function(tokenPathName, clientName) {
            return new Promise((resolve, reject) => {
                
                const tokenPath = nconf.get( nconf.get('resolveTokenKey')(nconf, nconf.get('mode'), tokenPathName) );
                
                fs.readFile(tokenPath, 'utf8', (err, data) => {
                    
                    if (err) {
                        this.logUninitializedVar(tokenPathName, clientName);
                        reject(err);
                    }
                    
                    resolve(data);
                });
            });
        },
        logUninitializedVar: function(tokenPathName, clientName) {
            const clientMessagePortion = clientName ? ', cannot initialize ' + clientName + ' client.' : '';
            console.log(red('Evironment variable may not set: \'<' + tokenPathName + '>\'' + clientMessagePortion));
        }
    };
})();