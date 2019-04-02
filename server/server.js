// Importing package dependencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const _ = require('lodash');

/*
Importing and setting configuration data

NOTE: You should modify ./server-config.json to contain
your own credentials before using this application
*/
const configuration = require('./server-config.json');
const authConfig = configuration.auth;
const clientResponseConfig = configuration.clientResponse;

// Initializing application and setting port
const app = express();
const port = process.env.PORT || 5000;

// Serve statically from build folder if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
}

// CORS configuration
const corsOptions = {
  origin: 'null',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: 'Content-Type',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Setting JSON spacing
app.set('json spaces', 2);
// Using bodyParser for JSON body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting trust proxy for express-session cookies
app.set('trust proxy', 1);

/*
Using express-session for maintaining
user sessions through cookies
*/
app.use(session({
  name: 'clientresponse-demo-session',
  secret: 'clientresponse-demo-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // A cookie is valid for 1 hour
    secure: false // Cookie can be used over http as well (Don't do this for a production app)
  }
}));

app.listen(port);


/*
Function to set OAuth2 Token Data as a
session variable so that it is available
for all requests during a user session
*/
function setAccessToken(req, res, next) {
  /*
  Obtain access token using either authorization
  code or refresh token, by calling
  `https://api.bazaarvoice.com/auth/v1/oauth2/token` endpoint
  */
  if (req.route.path === '/api/redirect') {
    /*
    If the incoming request is a redirection from
    OAuth2 service, then use the auth code from
    request's query params to obtain an access token
    */
    const options = {
      method: 'POST',
      url: `${authConfig.endpoint}/token`,
      qs: {
        passkey: authConfig.passkey
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        code: req.query.code,
        grant_type: 'authorization_code',
        client_id: authConfig.client_id,
        redirect_uri: authConfig.redirect_uri,
        client_secret: authConfig.client_secret
      }
    };

    rp(options)
      .then(function(body) {
        req.session.token_data = JSON.parse(body);
        next();
      })
      .catch(function(error) {
        res
          .status(500)
          .json(JSON.parse(error.error));
      });
  } else if (req.session.token_data.expires_at - Math.round(Date.now() / 1000) < 60) {
    /*
    If currently available token is expiring within
    a minute or has already expired, then use the
    refresh token to obtain a new access token
    */
    const options = {
      method: 'POST',
      url: `${authConfig.endpoint}/token`,
      qs: {
        passkey: authConfig.passkey
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        refresh_token: req.session.token_data.refresh_token,
        grant_type: 'refresh_token',
        client_id: authConfig.client_id,
        redirect_uri: authConfig.redirect_uri,
        client_secret: authConfig.client_secret
      }
    };

    rp(options)
      .then(function(body) {
        req.session.token_data = JSON.parse(body);
        next();
      })
      .catch(function(error) {
        res
          .status(500)
          .json(JSON.parse(error.error));
      });
  } else {
    /*
    If a valid access token has already been set, then
    move on to the next step without doing anything
    */
    next();
  }
}


// This endpoint checks if a user is logged in
app.get('/api/check-login', (req, res) => {
  if (!_.isEmpty(req.session.token_data)) {
    // Checking if token_data has been set
    res
      .status(200)
      .json({ logged_in: true });
  } else {
    res
      .status(200)
      .json({ logged_in: false });
  }
});


/*
This endpoint queries Client Response API and fetches all
Client Responses for a unique pair of Client name and
Review ID, using a client's passkey and OAuth2 access token
*/
app.get('/api/sites/:client/reviews/:reviewId/clientResponses', setAccessToken, (req, res) => {

  const options = {
    method: 'get',
    url: `${clientResponseConfig.endpoint}/sites/${req.params.client}/reviews/${req.params.reviewId}/clientResponses`,
    qs: {
      passkey: clientResponseConfig.passkey
    },
    headers: {
      Authorization: `Bearer ${req.session.token_data.access_token}`
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(JSON.parse(error.error));
    } else {
      res
        .status(response.statusCode)
        .json(JSON.parse(body));
    }
  });
});


/*
This endpoint queries Client Response API and fetches
a single Client Response by its Response GUID, using
a client's passkey and OAuth2 access token
*/
app.get('/api/clientResponses/:responseGuid', setAccessToken, (req, res) => {

  const options = {
    method: 'get',
    url: `${clientResponseConfig.endpoint}/clientResponses/${req.params.responseGuid}`,
    qs: {
      passkey: clientResponseConfig.passkey
    },
    headers: {
      Authorization: `Bearer ${req.session.token_data.access_token}`
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(JSON.parse(error.error));
    } else {
      res
        .status(response.statusCode)
        .json(JSON.parse(body));
    }
  });
});

/*
This endpoint posts a new client response to the
Client Response API for a unique pair of Client name and
Review ID, using a client's passkey and OAuth2 access token
*/
app.post('/api/sites/:client/reviews/:reviewId/clientResponses', setAccessToken, (req, res) => {

  const options = {
    method: 'post',
    url: `${clientResponseConfig.endpoint}/sites/${req.params.client}/reviews/${req.params.reviewId}/clientResponses`,
    qs: {
      passkey: clientResponseConfig.passkey
    },
    body: JSON.stringify(req.body),
    headers: {
      Authorization: `Bearer ${req.session.token_data.access_token}`,
      'Content-Type': 'application/json'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(JSON.parse(error.error));
    } else {
      res
        .status(response.statusCode)
        .json(JSON.parse(body));
    }
  });
});

/*
This endpoint sends a put request to the Client Response API
for modifying a single Client Response by its Response GUID,
using a client's passkey and OAuth2 access token
*/
app.patch('/api/clientResponses/:responseGuid', setAccessToken, (req, res) => {

  const options = {
    method: 'patch',
    url: `${clientResponseConfig.endpoint}/clientResponses/${req.params.responseGuid}`,
    qs: {
      passkey: clientResponseConfig.passkey
    },
    body: JSON.stringify(req.body),
    headers: {
      Authorization: `Bearer ${req.session.token_data.access_token}`,
      'Content-Type': 'application/json'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(JSON.parse(error.error));
    } else {
      res
        .status(response.statusCode)
        .json(JSON.parse(body));
    }
  });
});

/*
This endpoint sends a delete request to the Client Response API
for deleting a single Client Response by its Response GUID,
using a client's passkey and OAuth2 access token
*/
app.delete('/api/clientResponses/:responseGuid', setAccessToken, (req, res) => {

  const options = {
    method: 'delete',
    url: `${clientResponseConfig.endpoint}/clientResponses/${req.params.responseGuid}`,
    qs: {
      passkey: clientResponseConfig.passkey
    },
    headers: {
      Authorization: `Bearer ${req.session.token_data.access_token}`,
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(JSON.parse(error.error));
    } else if (response.statusCode === 204) {
      res
        .status(response.statusCode)
        .send();
    } else {
      res
        .status(response.statusCode)
        .send(JSON.parse(body));
    }
  });
});

/*
This endpoint receives redirection from OAuth2 service, uses
the auth code to retrieve an access token in the function
setAccessToken(), then sets it as globally accessible data.
Further, it takes the user to the appropriate page
*/
app.get('/api/redirect', setAccessToken, (req, res) => {
  /*
  Take user to their last visited page if it
  exists, else take them to the Search page
  */
  const redirectPage = req.session.last_visited || '/search';
  res.redirect(302, redirectPage);
});


/*
Handles any undefined GET calls and returns
the React App pages accordingly
*/
app.get('/*', function (req, res) {

  req.session.last_visited = req.originalUrl;

  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  } else {
    res
      .status(200)
      .json({});
  }
});
