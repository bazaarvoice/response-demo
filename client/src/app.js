import React, { Component } from 'react';
import ReviewPage from './components/reviewPage';
import 'semantic-ui-css/semantic.min.css';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import './css/SearchBar.css';
import SearchPage from './components/searchPage';
import { configurations }  from './utils/config.js';
import { checkLogin } from './api/client';

// An object which maps routes to React Components
const PAGES = {
  '/review': ReviewPage,
  '/search': SearchPage,
};


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  componentWillMount() {
    /*
    Before loading anything, verify that the user is logged in.
    If not, take them to Bazaarvoice OAuth2 login page.
    */
    checkLogin().then((response) => {
      if (!response.logged_in) {
        const authConfig = configurations.auth;
        window.location = `${authConfig.endpoint}/auth?client_id=${authConfig.client_id}&redirect_uri=${authConfig.redirect_uri}&passkey=${authConfig.passkey}`;
      } else {
        this.setState({
          loaded: true,
        });
      }
    });
  }

  render() {
    if (this.state.loaded === true) {
      /*
      If login verification has been performed successfully,
      render the page corresponding to current pathname
      */
      const Handler = PAGES[this.props.location.pathname] || SearchPage;
      return <Handler { ...this.props }/>;
    } else {
      /*
      If login verification is being performed,
      dim screen and render a loading animation
      */

      // Setting style for global elements
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'div { height:100%; width:100% }';
      document.getElementsByTagName('head')[0].appendChild(style);

      return (
        <Segment>
          <Dimmer active>
            <Loader size='massive'>Verifying Login Info...</Loader>
          </Dimmer>
        </Segment>
      );
    }
  }
}
