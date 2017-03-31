(()=>{
    /**
     * This build script should be ran before you attempt to start this headless application.
     * All we really need to do here is kick off an npm install of all the app dependencies.
     */

    const npm  = require('npm');
    const fs   = require('fs');
    const path = require('path');
    const NODE_MODULES = 'node_modules';
    //options which will be passed to all npm.load commands
    const loadOptions = {
        'strict-ssl': false
    }; 
    
    const deleteFolderRecursive = function(path){
        if(fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file,index){
                let curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { 
                    // recurse
                    deleteFolderRecursive(curPath);
                } else { 
                    // delete file
                    fs.unlinkSync(curPath);
                }
            }.bind(this));
            
            fs.rmdirSync(path);
        }
    };

    const buildMeta = {
        cleanUpDirs: [path.join(process.cwd(), NODE_MODULES)],
        cleanUp: function(paths){
            for(let i = 0; i < paths.length; i++) {
                console.log('Cleaning/Deleting folder:', paths[i]);
                deleteFolderRecursive(paths[i]);
            }
        },
        runBuild: function(){
            let startTime = new Date();
            
            //delete node_modules dir, this happens synchronously atm (no need to make promises).
            this.cleanUp(this.cleanUpDirs);
            
            //run the npm install
            return this.runNpmInstall()
                    .then(function(){
                        let endTime = new Date();
                        
                        const green = require('chalk').green,
                              cyan  = require('chalk').cyan;
                        console.log( green( 'Build finished in '+ (endTime - startTime) + ' ms.' ) );
                        console.log( cyan ( ' -> Start server in dev mode by running: \'npm run start-dev\'') );
                    });
            
        },
        runNpmInstall : function(){
            return new Promise((resolve, reject) =>{
                // npm install in root
                npm.load(loadOptions, function () {
                    // Set NPM_CONFIG_STRICT_SSL for spawned processes (phantomjs)
                    process.env['NPM_CONFIG_STRICT_SSL'] = 'false';
                    npm.commands.install(path.join(__dirname), [], function () {
                        resolve();
                    });
                });
            });
        }
    };

    //Kick off the build
    buildMeta.runBuild();
})();