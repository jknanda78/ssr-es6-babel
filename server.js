#!/bin/env node
require('babel-register');
var express = require('express');

//JSX Transpiler
// require("node-jsx").install({harmony: true});

var React = require('react');
// var SignInScreen = React.createFactory(require('./src/js/components/signin').default);

var SignInScreen = React.createFactory(require('./src/js/components/signin').SignIn);

var bodyParser = require('body-parser');
var compression = require('compression');

/**
 *  Define the application.
 */
var SSRApp = function() {
  //  Scope.
  var self = this;

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
      //  Set the environment variables we need.
      self.port = process.env.PORT || 9000;
      self.domain = (process.env.NODE_ENV === 'production') ? 'http://shopping.herokuapp.com' : 'http://local.dev.com:9000';
  };

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
      self.app = express();

      //Allow CORS
      self.app.use(self.setupCORS);

      //Compress using gzip
      self.app.use(compression());

      //Body Parser
      self.app.use(bodyParser.json());
      self.app.use(bodyParser.urlencoded({ extended: false }));
  };

  /**
   *  Start the server (starts up the  application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, function() {
      console.log('%s: Node server started on %s:%d ...',
          Date(Date.now() ), self.port);
    });

    self.app.get('/', function (req, res) {
      var signIn = React.renderToString(SignInScreen({ ssr: true }));

      var HTML = '<!doctype html><html><head><title>Server-Side Rendering with ES6 & Babel</title></head><body class="landing"><div id="container">'+ signIn +'</div><link href="http://fonts.googleapis.com/css?family=Pontano+Sans" rel="stylesheet" type="text/css" /></body></html>';

      res.send(HTML);
    });
  }

  /**
   *  Initializes the application.
   */
  self.initialize = function() {
      self.setupVariables();

      // Create the express server and routes.
      self.initializeServer();
  };

  //Setup CORS
  self.setupCORS = function(req, res, next){
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With, X-Custom-Header');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', 86400);
      res.sendStatus(200).end();
    }
    else {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      next();
    }
  };
};

var app = new SSRApp();
app.initialize();
app.start();
