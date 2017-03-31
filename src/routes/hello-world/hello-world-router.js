(() => {
    'use strict';
    const express = require('express');

    /**
     * This router, is just a hello world test.
     */
    module.exports = () => {
        return {
            configure: () => {
                let router = express.Router();
				
                // You can test this route to make sure everything is working (accessed at GET http://localhost:7000/test )    
                router.get('/:dat?', (req, res) => {
                    res.send('Success -> '+req.params.dat);
                });
                
                return router;
            }
        };
    };
})();