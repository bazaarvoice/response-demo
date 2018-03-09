import React, { Component } from 'react';
import ClientResponsesSection from './clientResponsesSection';
import moment from 'moment';
import 'semantic-ui-css/semantic.min.css';
import { Item, Dimmer, Loader, Segment, Rating, Input , Menu, Button, Label } from 'semantic-ui-react';
import '../css/ReviewSection.css';
import { getReviewDataById, getClientResponsesForReview } from '../api/client.js';
import BVLogo from '../assets/bv-logo.png';
import * as querystring from 'querystring';
import { configurations }  from '../utils/config.js';


export default class ReviewPage extends Component {

  constructor(props) {
    super(props);
    const query = querystring.parse(this.props.location.search.slice(1));
    this.state = { SearchQuery: query.SearchQuery };
  }

  /*
  Function to fetch a review by Review ID, fetch ClientResponses
  for that review and assign state variables accordingly
  */
  fetchReviewFromAPI = (reviewId) => {
    getReviewDataById(reviewId).then((reviewData) => {
      if (reviewData.Results[0]) {
        /*
        If the API returns a review then get client responses for that
        review and assign desired fields to state variables for future use
        */
        getClientResponsesForReview(configurations.client_name, reviewData.Results[0].Id)
          .then((clientResponseData) => {
            this.setState({
              Reload: false,
              InvalidReviewId: false,
              ReviewData: {
                ReviewId: reviewData.Results[0].Id,
                Title: reviewData.Results[0].Title,
                ReviewText: reviewData.Results[0].ReviewText,
                Rating: reviewData.Results[0].Rating,
                RatingRange: reviewData.Results[0].RatingRange,
                Author: reviewData.Results[0].UserNickname,
                ProductName: reviewData.Includes.Products[reviewData.Results[0].ProductId].Name,
                SourceClient: configurations.client_name,
                SubmissionTime: reviewData.Results[0].SubmissionTime,
                ClientResponses: clientResponseData.data
              }
            });
          });
      } else {
        /*
        Otherwise, user entered an invalid Review ID.
        Therefore, set InvalidReviewId flag to true.
        */
        this.setState({ InvalidReviewId: true });
      }
    });
  };

  // Just before this class is rendered, componentWillMount is called
  componentWillMount = () => {
    /*
    Before this class is rendered, change the HTML title and
    fetch review data from API so that it can be displayed.
    */
    document.title = 'Review Page';
    this.fetchReviewFromAPI(this.state.SearchQuery);
  };

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
    If input field is not blank, set query parameter
    to the new  value and reload page with it, else
    highlight the input field indicating invalid Review ID
    */
    if (this.state.SearchQuery) {
      this.props.location.search = `?SearchQuery=${this.state.SearchQuery}`;
      this.setState({ Reload: true });
    } else {
      this.setState({ InvalidReviewId: true });
    }
  };

  render = () => {

    if (this.state.Reload === true) {
      /*
      If Reload has been set to true, then reload
      the review page with the new SearchQuery
      */
      return <ReviewPage { ...this.props } />;
    } else if (this.state.InvalidReviewId === true) {
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
              <Input value={this.state.SearchQuery} type='text' error placeholder='Review ID...' action onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
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

      /*
      Converting review submission time from ISO 8601 format
      to a more intuitive format and user's local timezone
      */
      const readableSubmissionTime = moment(this.state.ReviewData.SubmissionTime)
        .local()
        .format('[on] MMMM Do, YYYY [at] hh:mm A');

      return (
        <div className='Review Page'>

          <Menu>

            <Menu.Item position='left'>
              <img src={BVLogo} alt='Bazaarvoice Logo' />
            </Menu.Item>

            <Menu.Item>
              <Input value={this.state.SearchQuery} type='text' placeholder='Review ID...' action onChange={ this.handleSearchChange } onKeyPress={ this.handleKeyPress }>
                <input />
                <Button type='submit' onClick={this.handleSubmit} >Search</Button>
              </Input>
            </Menu.Item>

          </Menu>

          <Item.Group className={'ReviewSection'}>

            <Item>
              <Item.Content>
                <Item.Header as='a'>{ this.state.ReviewData.Title }</Item.Header>
                <Item.Meta>
                  <span>by { this.state.ReviewData.Author } { readableSubmissionTime }</span><br/><br/>
                  <Rating disabled maxRating={ this.state.ReviewData.RatingRange } rating={ this.state.ReviewData.Rating } icon='star' />
                </Item.Meta>
                <Item.Description>{ this.state.ReviewData.ReviewText }</Item.Description>
                <Item.Extra>
                  <Label>{ this.state.ReviewData.ProductName }</Label>
                </Item.Extra>
              </Item.Content>
            </Item>

          </Item.Group>

          <ClientResponsesSection ClientResponsesData={ this.state.ReviewData.ClientResponses } Client={ this.state.ReviewData.SourceClient } ReviewId={ this.state.ReviewData.ReviewId }/>

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
            <Loader size='massive'>Loading Review Page...</Loader>
          </Dimmer>
        </Segment>
      );
    }
  };
}
