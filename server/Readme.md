How to run
----------

This server runs on Node.JS with a few packages required.

1. Get Node.JS (0.10 recommended) and `npm` (should be installed along NodeJS)
2. `npm install jade express@3 stylus oauth`
3. Copy `config.example.js` to `config.js` and edit needed things (you need to create an app in Twitter)
4. Run `node server.js` (or with `forever`, or `nohup`, or whatever you use to keep it running in case of a crash)

Nginx configuration
-------------------

This is what is deployed in my server (https://twitta.pijusmagnificus.com/).

1. Node is running as above in localhost
2. Nginx is used as a proxy and SSL endpoint.
