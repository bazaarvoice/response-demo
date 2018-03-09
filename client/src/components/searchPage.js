import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';
import '../css/SearchBar.css';
import '../css/Background.css';


export default class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  // Function to update state variable as user changes their input
  handleSearchChange = (event, { value }) => {
    this.setState({ SearchQuery: value });
  };

  // Function which handles pressing the Enter key while on the input field
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  };

  // Function which handles search submissions
  handleSubmit = () => {
    /*
    If input field is not blank, render the review
    page, providing it search query through props
    else focus on the field, prompting user to type
    */
    if (this.state.SearchQuery) {
      window.location = `/review?SearchQuery=${this.state.SearchQuery}`;
    }
  };

  render = () => {
    /*
    Rendering a simple page with a background
    image and centered search bar on top
    */

    // Setting style for global elements
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'div { height:100%; width:100% }';
    document.getElementsByTagName('head')[0].appendChild(style);

    return (
      <div className="container Background">

        <section className="centered SearchBar" >
          <Input fluid type='text' placeholder='Review ID...' action onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
            <input />
            <Button type='submit' onClick={ this.handleSubmit } >Search</Button>
          </Input>
        </section>

      </div>
    );

  };
}


