import React, { Component } from 'react';
import { getReviewDataById } from '../api/client.js';
import 'semantic-ui-css/semantic.min.css';
import { Item, Dimmer, Loader, Segment, Rating, Input , Menu, Button, Label } from 'semantic-ui-react';
import BVLogo from '../assets/bv-logo.png';


export default class ReviewPage extends Component {

  constructor(props) {
    super(props);
    this.state = { SearchQuery: this.props.SearchQuery };
  }

  /*
  Function to fetch a review by Review ID and
  assign state variables accordingly
  */
  fetchReviewFromAPI = (reviewId) => {
    getReviewDataById(reviewId).then((results) => {
      if (results.Results[0]) {
        /*
        If the API returns a review then assign desired
        field to state variables for future use
        */
        this.setState({
          InvalidReviewId: false,
          ReviewData: {
            Title: results.Results[0].Title,
            ReviewText: results.Results[0].ReviewText,
            Rating: results.Results[0].Rating,
            RatingRange: results.Results[0].RatingRange,
            Author: results.Results[0].UserNickname,
            ProductName: results.Includes.Products[results.Results[0].ProductId].Name
          }
        });
      } else {
        /*
        Otherwise, user entered an invalid Review ID.
        Therefore, set InvalidReviewId flag to true.
        */
        this.setState({ InvalidReviewId: true });
      }
    });
  }

  // Just before this class is rendered, componentWillMount is called
  componentWillMount() {
    /*
     Before this class is rendered, change the HTML title and
     fetch review data from API so that it can be displayed.
     Also, set SearchQuery to blank as it is not needed anymore.
    */
    document.title = 'Review Page';
    this.fetchReviewFromAPI(this.state.SearchQuery);
    this.setState({ SearchQuery: '' });
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
    If input field is not blank, fetch review data from
    API else focus on the field, prompting user to type
    */
    if (this.state.SearchQuery) {
      this.fetchReviewFromAPI(this.state.SearchQuery);
    } else {
      this.inputFocus();
    }
  };

  render() {
    if (this.state.InvalidReviewId === true) {
      /*
      If an invalid Review ID was provided, render only
      the top banner alerting user about invalid input
      */

      // Setting style for global elements
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'div {height:auto; width:auto}';
      document.getElementsByTagName('head')[0].appendChild(style);

      return (
        <div className='Review Page'>
          <Menu>

            <Menu.Item position='left'>
              <img src={BVLogo} alt='Bazaarvoice Logo' />
            </Menu.Item>

            <Menu.Item>
              <Label basic color='red' pointing='right'>Please enter a valid Review ID</Label>
              <Input type='text' error placeholder='Review ID...' action ref={ this.handleInputRef } onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
                <input />
                <Button type='submit' onClick={this.handleSubmit} >Search</Button>
              </Input>
            </Menu.Item>

          </Menu>
        </div>
      );
    } else if (this.state.ReviewData) {
      /*
      If the Review ID is valid and ReviewData has
      been loaded successfully, render a top banner
      along with a block showing details of a review
      */

      // Setting style for global elements
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'div {height:auto; width:auto}';
      document.getElementsByTagName('head')[0].appendChild(style);

      // Defining style for local elements
      const localItemGroupStyle = { padding: '5px' };

      return (
        <div className='Review Page'>

          <Menu>

            <Menu.Item position='left'>
              <img src={BVLogo} alt='Bazaarvoice Logo' />
            </Menu.Item>

            <Menu.Item>
              <Input type='text' placeholder='Review ID...' action ref={ this.handleInputRef } onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
                <input />
                <Button type='submit' onClick={this.handleSubmit} >Search</Button>
              </Input>
            </Menu.Item>

          </Menu>

          <Item.Group style={ localItemGroupStyle }>

            <Item>
              <Item.Content>
                <Item.Header as='a'>{ this.state.ReviewData.Title }</Item.Header>
                <Item.Meta>
                  <span>by { this.state.ReviewData.Author }</span><br/><br/>
                  <Rating disabled maxRating={ this.state.ReviewData.RatingRange } rating={ this.state.ReviewData.Rating } icon='star' />
                </Item.Meta>
                <Item.Description>{ this.state.ReviewData.ReviewText }</Item.Description>
                <Item.Extra>
                  <Label>{ this.state.ReviewData.ProductName }</Label>
                </Item.Extra>
              </Item.Content>
            </Item>

          </Item.Group>

        </div>
      );
    } else {
      /*
      If valid Review ID was provided, but data is still being
      loaded, dim screen and render a loading animation
      */

      // Setting style for global elements
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'div { height:100%; width:100% }';
      document.getElementsByTagName('head')[0].appendChild(style);

      return (
        <Segment>
          <Dimmer active>
            <Loader size='massive'>Loading</Loader>
          </Dimmer>
        </Segment>
      );
    }
  }
}
