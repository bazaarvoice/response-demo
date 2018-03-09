import React, { Component } from 'react';
import moment from 'moment';
import 'semantic-ui-css/semantic.min.css';
import { Comment } from 'semantic-ui-react';
import avatar from '../assets/avatar.png';

// This class manages the rendering of a single client response
export default class ClientResponse extends Component {

  constructor(props) {
    super(props);
    this.state = { ClientResponseData: this.props.ClientResponseData };
  }

  render = () => {
    /*
    Converting client response modification
    time from ISO 8601 format to a more
    intuitive format and user's local timezone
    */
    const readableModificationTime = moment(this.state.ClientResponseData.DateUpdated)
      .local()
      .format('[on] MMMM Do, YYYY [at] hh:mm A');

    return (
      <Comment>
        <Comment.Avatar src={ avatar } />
        <Comment.Content>
          <Comment.Author as='a'>{ this.state.ClientResponseData.Client }</Comment.Author>
          <Comment.Metadata>
            <div>Modified { readableModificationTime }</div><br />
          </Comment.Metadata>
          <Comment.Text>{ this.state.ClientResponseData.Response }</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  }
}
