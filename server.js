(()=> {
    const path = require('path');
    
    //Load and display server config
    require(path.join(__dirname, 'src', 'config','loader'))();
    
    //Initialize Server
    require(path.join(__dirname, 'src', 'init', 'express-init'))().initialize();
})();
