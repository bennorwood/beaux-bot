# Beaux Bot!
![alt tag](http://i.imgur.com/OYYn9jJ.png)

[![Build Status](https://travis-ci.org/bennorwood/beaux-bot.svg?branch=master)](https://travis-ci.org/bennorwood/beaux-bot)

Beaux Bot is a bot client application that utilizes Natural Language Processing(NLP) to understand user intent and give data driven responses
if the user's intent maps to an active domain (similar to an 'area of expertise').

_**Before attempting to run this app locally, you will need to complete the 'Building' & 'Configuration' sections:**_
## Building 
To build this headless application, run the following command:

```
npm run build
```

## Contributing!

Before submitting any code for review, please run the following:

```
npm test
```

And make any necessary code changes if the JS linting fails.

## Configuration
To specify your own config overrides, you may set the environment variables listed below or edit the 'custom.config.json' file in the beaux-bot/src/config/ directory. This json file will
override any of the default configuration specified in the beaux-bot/src/config/configuration.js file. Command line and environment variables 
will still take precedence over properties specified in your custom.config.json file.

> Note: Never store your keys in a public repo! The custom.config.json file is in the .gitignore for a reason!

### Using the api.ai manager

_When running in Production mode_

To use the api.ai manager you need to update the following environment variable:

```
SET APIAI_CLIENT_ACCESS_TOKEN <access_token>
```

_When running in Development mode_

If you want to use a personal agent created using the api.ai manager for development reasons you need to update the following environment variable:

```
SET DEV_APIAI_CLIENT_ACCESS_TOKEN <access_token>
```

### Using the Slack IM client

_When running in Production mode_

To use the slack bot client you need to update the following environment variable:

```
SET SLACKBOT_CLIENT_ACCESS_TOKEN <access_token>
```

_When running in Development mode_

If you want to use a personal slack bot created using 'http://my.slack.com/services/new/bot' for development reasons you need to update the following environment variable:

```
SET DEV_SLACKBOT_CLIENT_ACCESS_TOKEN <access_token>
```

## Running the server
### To run the server normally execute the following command:

```
npm start
```

### To run in DEVELOPMENT mode execute the following command:

```
npm run start-dev
```

## Debugging the Server
To debug the server using Chrome dev tools run the following command:

```
node --inspect --debug-brk server.js
```
