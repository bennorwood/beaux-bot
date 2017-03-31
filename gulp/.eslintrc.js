module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'node': 1 //currently running es6 linting on node server files only
    },
    'globals': {
        'Promise': true
    },
    'rules': {
        // enable additional rules
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],

        // override default options for rules from base configurations
        'no-cond-assign': ['error', 'always'],
        
        // disable rules from base configurations
        //TODO: Use log4js for proper loggingg strategy
        'no-console': 'off',
    },
    'parserOptions': {
        'ecmaVersion': 6,
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true
        }
    }
}