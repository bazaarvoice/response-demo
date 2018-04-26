import React, { Component } from 'react';
import ClientResponse from './clientResponse.js';
import _ from 'lodash';
import '../css/ClientResponsesSection.css';
import 'semantic-ui-css/semantic.min.css';
import { Comment, Header, Form, Button } from 'semantic-ui-react';
import { getClientResponsesForReview, postClientResponse } from '../api/client';
import { configurations } from '../utils/config';
import { departmentFormOptions } from '../utils/departmentFormOptions';

// This class manages the rendering of the entire client responses section
export default class ClientResponsesSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ReviewId: this.props.ReviewId,
      CreateResponseDepartment: '',
      CreateResponseText: '',
      SubmitButtonLoading: false,
      FormLoading: false
    };
  }

  /*
  Function to fetch all ClientResponses for a review, using
  Client Name and Review ID, assign state variables accordingly
  */
  fetchClientResponsesFromAPI = () => {
    getClientResponsesForReview(configurations.client_name, this.state.ReviewId)
      .then((clientResponseData) => {
        if (!clientResponseData.errors) {
          this.setState({ ClientResponsesData: clientResponseData.data });
        } else {
          this.setState({ ClientResponsesData: [] });
        }
      });
  };

  // Just before this class is rendered, componentWillMount is called
  componentWillMount = () =>
    this.fetchClientResponsesFromAPI();

  // Function to create a new ClientResponses for a review
  createClientResponseFromAPI = () => {
    postClientResponse(
      configurations.client_name,
      this.state.ReviewId,
      this.state.CreateResponseText,
      this.state.CreateResponseDepartment)
      .then((clientResponse) => {
        if (!clientResponse.errors) {
          /*
          After a client response is successfully posted, add
          the new client response to the ClientResponsesData state
          array and reset the post form to its original state
          */
          let currentClientResponsesData = this.state.ClientResponsesData;
          currentClientResponsesData.push(clientResponse);
          this.setState({
            ClientResponsesData: currentClientResponsesData,
            CreateResponseDepartment: '',
            CreateResponseText: '',
            SubmitButtonLoading: false,
            FormLoading: false
          });
        } else {
          this.setState({
            CreateResponseDepartment: '',
            CreateResponseText: '',
            SubmitButtonLoading: false,
            FormLoading: false
          });
        }
      });
  };

  // Function which updates state as form values change
  handleChange = (e, { name, value }) =>
    this.setState({ [name]: value });

  // Function which handles submissions
  handleSubmit = () => {
    if (this.state.CreateResponseDepartment && this.state.CreateResponseText) {
      /*
      If required fields are non-empty, submit the client response
      through API and temporarily send the form into a loading
      state while waiting for a response from the API
      */
      this.createClientResponseFromAPI();
      this.setState({
        SubmitButtonLoading: true,
        FormLoading: true
      });
    }
  };

  render = () => {

    if (this.state.ClientResponsesData) {
      /*
      If ClientResponsesData has been loaded successfully, render
      ClientResponsesSection displaying all ClientResponses for
      the review and a form to submit new ClientResponses
      */

      /*
      Iterating over Client Responses and generating its
      HTML templates to be rendered within this section
      */
      let clientResponsesView = this.state.ClientResponsesData
        .map((clientResponse, index) => {
          const clientResponseData = {
            ResponseGuid: clientResponse.id,
            Response: clientResponse.attributes.response,
            DateCreated: clientResponse.attributes.created,
            DateUpdated: clientResponse.attributes.updated,
            ResponseSource: clientResponse.attributes.responseSource,
            Department: clientResponse.attributes.department,
            ResponseBy: clientResponse.attributes.responseBy
          };
          return <ClientResponse key={ index } ClientResponseData={ clientResponseData }
                                 departmentFormOptions={ departmentFormOptions } />;
        });

      return (
        <Comment.Group className={ 'ClientResponsesSection' }>
          <Header as='h3' dividing>Client Responses</Header>
          {/*
          If there are no client responses for this review,
          print suitable message else show client responses
          */}
          { _.isEmpty(clientResponsesView)? <span>No Client Responses for this review</span>: clientResponsesView }
          <Form reply loading={ this.state.FormLoading }>
              <Form.Select label='Department' name='CreateResponseDepartment' onChange={ this.handleChange }
                           onKeyPress={ this.handleKeyPress } value={ this.state.CreateResponseDepartment }
                           options={ departmentFormOptions } placeholder='Your Department...' required />
            <Form.TextArea label='Response' name='CreateResponseText' onChange={ this.handleChange }
                           onKeyPress={ this.handleKeyPress } value={ this.state.CreateResponseText }
                           placeholder='Your Response...' required/>
            <Button loading={ this.state.SubmitButtonLoading } content='Add Client Response'
                    labelPosition='left' icon='edit' primary onClick={ this.handleSubmit } />
          </Form>
        </Comment.Group>
      );
    } else {
      // If ClientResponses could not be fetched, don't render anything
      return (null);
    }
  }
}
