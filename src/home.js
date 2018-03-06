import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReviewPage from './components/reviewPage';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button } from 'semantic-ui-react';
import Background from './assets/search-background.jpg';


export default class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  // Function which handles references from the input field
  handleInputRef = (c) => {
    this.inputRef = c;
  }

  // When this function is called, the input field is focused
  inputFocus = () => {
    this.inputRef.focus();
  }

  // Function to update state variable as user changes their input
  handleSearchChange = (e, { value }) => {
    this.setState({ SearchQuery: value });
  }

  // Function which handles pressing the Enter key while on the input field
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  // Function which handles search submissions
  handleSubmit = () => {
    /*
    If input field is not blank, render the review
    page, providing it search query through props
    else focus on the field, prompting user to type
    */
    if (this.state.SearchQuery) {
      ReactDOM.render(<ReviewPage SearchQuery={ this.state.SearchQuery }/>, document.getElementById('root'));
    } else {
      this.inputFocus();
    }
  }

  render() {
    /*
    Rendering a simple page with a background
    image and centered search bar on top
    */

    // Setting style for global elements
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'div { height:100%; width:100% }';
    document.getElementsByTagName('head')[0].appendChild(style);


    // Defining style for local elements
    const localDivStyle = {
      backgroundImage: `url(${Background})`,
      backgroundSize: '100%',
      backgroundPosition: 'absolute'
    };
    const localSectionStyle = {
      width: '50%'
    };

    return (
      <div className="container" style={ localDivStyle }>

        <section className="centered" style={ localSectionStyle }>
          <Input fluid type='text' placeholder='Review ID...' action ref={ this.handleInputRef } onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
            <input />
            <Button type='submit' onClick={ this.handleSubmit } >Search</Button>
          </Input>
        </section>

      </div>
    );

  }
}


