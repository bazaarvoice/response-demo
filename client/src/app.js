import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import LoginPage from './components/loginPage';
import SearchPage from './components/searchPage';
import ReviewPage from './components/reviewPage';
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
    Before loading anything, check whether user is
    logged in, and set state variables accordingly
    */
    checkLogin().then((response) => {
      if (response.logged_in === true) {
        this.setState({
          loaded: true,
          logged_in: true
        });
      } else {
        this.setState({
          loaded: true,
          logged_in: false
        });
      }
    });
  }

  render() {
    if (this.state.loaded === true) {
      /*
      If login verification has been
      performed, render components
      */
      if (this.state.logged_in === true) {
        /*
        If login verification has been performed successfully,
        render the page corresponding to current pathname
        */
        const Handler = PAGES[this.props.location.pathname] || SearchPage;
        return <Handler { ...this.props } />;
      } else {
        /*
        If user is not logged in, render application's Login page.
        */
        return <LoginPage />;
      }

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
