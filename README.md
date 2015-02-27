# collect.io-koa
koa based web app for collecting games

# dependencies
requires giantbomb-api, which is not an npm package. Clone from https://github.com/ckatzorke/giantbomb-api.git and use

    npm link

in this directory, call
    
    npm link giantbomb-api
    
# api key
Make sure to place the api key in src/handler/apikey.js like
    
    module.exports = '<your_api_key_here>';
    
# start

    iojs dist/index.js
    
# development
start the server (see above), and start the gulp watcher

    gulp

# example
Search for "Day of the Tentacle"

    http://localhost:3000/gb/search?q=Day%20of%20the%20Tentacle
    
Show details for DOTT

    http://localhost:3000/gb/detail?id=4372