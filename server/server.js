// Importing package dependencies
const express = require('express');
const request = require("request");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
}


// Global variable for maintaining state
let data = { };

// CORS configuration
const corsOptions = {
  origin: 'null',
  methods: ['GET', 'OPTIONS'],
  headers: 'Content-Type',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

/*
Using bodyParser for JSON
parsing and setting JSON spacing
*/
app.use(bodyParser.json());
app.set('json spaces', 2);


/*
Function to set OAuth2 Token Data as global
state so that it is available everywhere
*/
function setAccessToken(req, res, next) {
  if(req.route.path === '/api/redirect') {
    /*
    If the incoming request is a redirection from
    OAuth2 service, then use the auth code from
    request's query params to get an access token
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
    request(options, function (error, response, body) {
      if (error) {
        res
          .status(500)
          .json(error);
      } else {
        data.token_data = JSON.parse(body);
      }
    });
  } else if(data.token_data.expires_at - Date.now() < 60) {
    /*
    If currently available token is expiring within
    a minute or has already expired, then use the
    refresh token to get a new access token
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
        refresh_token: data.token_data.refresh_token,
        grant_type: 'refresh_token',
        client_id: authConfig.client_id,
        redirect_uri: authConfig.redirect_uri,
        client_secret: authConfig.client_secret
      }
    };
    request(options, function (error, response, body) {
      if (error) {
        res
          .status(500)
          .json(error);
      } else {
        data.token_data = JSON.parse(body);
      }
    });
  }

  next();
}


/*
This endpoint checks if an access token has been
set and if it will be valid for at least a
minute, and sends back an appropriate response
*/
app.get('/api/check-login', (req, res) => {
  if(data.token_data && data.token_data.expires_at - Date.now() < 60) {
    // Checking if token_data has been set and it will be valid for at least 60s
    res
      .status(200)
      .json({logged_in: true});
  } else {
    res
      .status(200)
      .json({logged_in: false});
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
      Authorization: `Bearer ${data.token_data.access_token}`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(error);
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
      Authorization: `Bearer ${data.token_data.access_token}`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      res
        .status(500)
        .json(error);
    } else {
      res
        .status(response.statusCode)
        .json(JSON.parse(body));
    }
  });
});


/*
This endpoint receives redirection from OAuth2 service, uses
the auth code to retrieve an access token in the function
setAccessToken(), then sets it as globally accessible data.
Further, it takes the user to the Search Page
*/
app.get('/api/redirect', setAccessToken, (req, res) => {
  res.redirect(302, '/search');
});


/*
Handles any undefined GET calls and returns
the React App pages accordingly
*/
app.get('*', function (req, res) {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  } else {
    res
      .status(200)
      .json({});
  }
});


app.listen(port, () => console.log(`Express server listening on port ${port}`));
