import React, { Component } from 'react';
import ClientResponse from './clientResponse.js';
import _ from 'lodash';
import '../css/ClientResponsesSection.css';
import 'semantic-ui-css/semantic.min.css';
import { Comment, Header } from 'semantic-ui-react';


// This class manages the rendering of the entire client responses section
export default class ClientResponsesSection extends Component {

  constructor(props) {
    super(props);
    this.state = { ClientResponsesData: this.props.ClientResponsesData };
  }

  render = () => {
    /*
    Iterating over Client Responses and generating its
    HTML templates to be rendered within the Review Page
    */
    const clientResponsesView = this.state.ClientResponsesData
      .map((clientResponse, index) => {
        const clientResponseData = {
          ResponseGuid: clientResponse.id,
          Response: clientResponse.attributes.response,
          DateCreated: clientResponse.attributes.created,
          DateUpdated: clientResponse.attributes.updated,
          Client: clientResponse.relationships.review.data.clientName,
          ResponseSource: clientResponse.attributes.responseSource,
          Department: clientResponse.attributes.department
        };
        return <ClientResponse key={ index } ClientResponseData={ clientResponseData }/>;
      });

    return (
      <Comment.Group className={ 'ClientResponsesSection' }>
        <Header as='h3' dividing>Client Responses</Header>
        {/*
        If there are no client responses for this review,
        print suitable message else show client responses
        */}
        { _.isEmpty(clientResponsesView)? <span>No Client Responses for this review</span>: clientResponsesView }
      </Comment.Group>
    );
  }
}
