import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Card, Image } from 'semantic-ui-react';
import '../css/SearchBar.css';
import '../css/Background.css';
import Logo from '../assets/bv-logo-2.jpg';
import { configurations }  from '../utils/config.js';


export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  handleConnect = () => {
    /*
    When user presses the Connect button, take them
    to Bazaarvoice OAuth2 Login page by calling the
    `https://api.bazaarvoice.com/auth/v1/oauth2/auth` endpoint
    */
    this.setState({ button_loading: true });
    const authConfig = configurations.auth;
    window.location = `${authConfig.endpoint}/auth?client_id=${authConfig.client_id}&redirect_uri=${authConfig.redirect_uri}&passkey=${authConfig.passkey}`;
  };

  render = () => {
    /*
    Rendering a simple page with a background image and centered
    Login component which does redirection to OAuth2 endpoint
    */

    // Setting style for global elements
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'div { height:100%; width:100% }';
    document.getElementsByTagName('head')[0].appendChild(style);

    // Defining style for local elements
    const localLogoStyle = {
      padding: '3px'
    };

    return (
      <div className="container Background">

        <section className="centered" >
          <Card>
            <Image src={ Logo } style={ localLogoStyle } />
            <Card.Content textAlign={'center'}>
              <Card.Header>
                Connect with Bazaarvoice
              </Card.Header>
              <Card.Meta>
              </Card.Meta>
              <Card.Description>
                Log in to Client Response Demo Application using your Bazaarvoice Portal Account
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button loading={ this.state.button_loading } onClick={ this.handleConnect } positive fluid>Connect</Button>
            </Card.Content>
          </Card>
        </section>

      </div>
    );

  };
}


