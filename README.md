[![Build Status](https://travis-ci.org/bazaarvoice/clientresponse-demo.svg?branch=master)](https://travis-ci.org/bazaarvoice/clientresponse-demo)

#Response Demo Application

This repository contains an example implementation of the Bazaarvoice Response API for our clients to reference in building their own integrations.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). For details on how to perform some common tasks, refer to [this](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Prerequisites
- Obtain a API key for [Response API](https://developer.bazaarvoice.com/response-api/home).
- Obtain a API key for [Conversations API](https://developer.bazaarvoice.com/conversations-api/home).
- Obtain [OAuth credentials](https://developer.bazaarvoice.com/response-api/getting-started#getting-access).
- Obtain a test reviewId to respond to. This can be done through the Bazaarvoice workbench or using the [reviews endpoint](https://developer.bazaarvoice.com/conversations-api/reference/v5.4/reviews/review-display) that is part of the [Conversations API](https://developer.bazaarvoice.com/conversations-api/home). 


## What is the sample doing?

The client response demo application uses three Bazaarvoice solutions, Conversations API, Response API, and OAuth in one application.  

After modifying the configuration files, described below, and starting the application, users must authenticate. 


<img src="https://dkv97bqrmxzll.cloudfront.net/img/git_hosted/authenicate.png" width="50%" />

They are then directed to a generic search interface requesting a reviewId.

<img src="https://dkv97bqrmxzll.cloudfront.net/img/git_hosted/search.png" width="50%" />

At that point, an call to the <a href="https://developer.bazaarvoice.com/conversations-api/home">Conversations API</a> returns review data. 

An API call is also made to the <a href="https://developer.bazaarvoice.com/response-api/home">Response API</a> to obtain any existing client responses. This is done to ensure the latest response data is obtained. There is a slight delay for responses to ELT back to the Conversations API data store.  

<img src="https://dkv97bqrmxzll.cloudfront.net/img/git_hosted/sections.png" width="50%"/>

For existing client responses, HTML controls are available to <a href="https://developer.bazaarvoice.com/response-api/reference/client-response/update-client-response">EDIT</a> and <a href ="https://developer.bazaarvoice.com/response-api/reference/client-response/delete-review-response">DELETE<a> the responses. There is also the ability to <a href="https://developer.bazaarvoice.com/response-api/reference/client-response/create-client-response">create a new response</a>. Two inputs are required for new responses, Department(string) and Response(string). For the purpose of the demo, the Department uses an hard-coded input dropdown. 

## Getting Started

- Open the Command Line or Terminal.
- Run the following commands to get a copy of this repository on your PC and navigate into it.
  ```
  git clone https://github.com/bazaarvoice/clientresponse-demo.git
  cd clientresponse-demo
  ```
  
- Make sure you have `Docker 18.03.0-ce` installed.
  - For instructions on installing Docker, see [this](https://docs.docker.com/install/#desktop)
  
## Local Deployment

* Modify `server/server-config.js` file to contain your backend credentials for different services.
* Modify `client/src/utils/config.js` file to contain your client-side credentials for different services.
* Make sure you are in the cloned directory and run following commands from your terminal:
  ```
  docker build -t clientresponse-demo .
  docker run -p 127.0.0.1:5000:5000/tcp -i -t clientresponse-demo:latest
  ```
* You can use the application by going to `http://localhost:5000` in your browser.

## Application Architecture

This application is split into two components - a Node.js Express server and a client-side React app. You can read more about this kind of setup [here](https://github.com/fullstackreact/food-lookup-demo).

* The [server](server/server.js) makes calls to the Bazaarvoice OAuth2 service for authentication and exposes endpoints to interact with the Client Response API.
* On the client-side, [client.js](client/src/api/client.js) provides modular functions which are used by front-end components to interact with the application's back-end, and with Bazaarvoice Conversations API to fetch reviews.
* The core front-end consists of two pages which are composed from four React [components](client/src/components):
  * **[Search Page](client/src/components/searchPage.js):** This is a simple page with a search bar which expects user to enter a Review ID which leads them to the Review Page.
  * **[Review Page](client/src/components/reviewPage.js):** This page expects a Review ID from the query parameters. It then queries the Conversation's API to fetch the corresponding review. Further, it queries the Client Response API to fetch all client responses for that review and renders the [ClientResponsesSection](client/src/components/clientResponsesSection.js) component with that data. In turn, this section renders each client response as a [ClientResponse](client/src/components/clientResponse.js) component. 


## Application Limitations

* **The application cannot maintain proper user sessions**	

  The express server currently uses just short-lived cookies for storing OAuth2 tokens. In a production application, you should maintain user sessions using cookies and session storage.

* **Current server implementation does not explicitly all handle error responses from API**

  All of the Bazaarvoice APIs send different error responses for invalid calls and a production application should handle and display them properly to the end user. Currently, this application assumes most calls to be valid and doesn't do explicit error handling. 

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Contributing

Found a bug or missing feature? Please open an issue!
Send your feedback. Send your pull requests. All contributions are appreciated.
