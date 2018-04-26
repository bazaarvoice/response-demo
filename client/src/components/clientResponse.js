import React, { Component } from 'react';
import moment from 'moment';
import 'semantic-ui-css/semantic.min.css';
import { Comment, Form, Button } from 'semantic-ui-react';
import avatar from '../assets/avatar.png';
import { putClientResponse, deleteClientResponse } from '../api/client';
import { departmentFormOptions } from '../utils/departmentFormOptions';

// This class manages the rendering of a single client response
export default class ClientResponse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ClientResponseData: this.props.ClientResponseData,
      Edit: false,
      SubmitButtonLoading: false
    };
  }

  // Function to delete a client response
  deleteClientResponseFromAPI = () => {
    deleteClientResponse(this.state.ClientResponseData.ResponseGuid)
      .then(() => {
        /*
        After the client response is successfully deleted, set
        state variable to prevent this response from rendering
        */
        this.setState({ Deleted: true });
      });
  };

  // Function to modify a client response
  putClientResponseFromAPI = () => {
    putClientResponse(
      this.state.ClientResponseData.ResponseGuid,
      this.state.EditResponseText,
      this.state.EditResponseDepartment)
      .then((clientResponse) => {
        if (!clientResponse.errors) {
          /*
        After the client response is successfully modified,
        reset the state variables to new values and
        the post form to its original state
        */
          this.setState({
            ClientResponseData: {
              ResponseGuid: clientResponse.id,
              Response: clientResponse.attributes.response,
              DateCreated: clientResponse.attributes.created,
              DateUpdated: clientResponse.attributes.updated,
              ResponseSource: clientResponse.attributes.responseSource,
              Department: clientResponse.attributes.department,
              ResponseBy: clientResponse.attributes.responseBy
            },
            Edit: false
          });
        } else {
          this.setState({ Edit: false });
        }
      });
  };

  // Function which updates state as form values change
  handleChange = (e, { name, value }) =>
    this.setState({ [name]: value });

  // Function which handles submissions
  handleSubmit = () => {
    if ((this.state.EditResponseDepartment === this.state.ClientResponseData.Department) &&
      (this.state.EditResponseText === this.state.ClientResponseData.Response)) {
      /*
      If user has not modified form values then send component
      into view state without making any API calls
      */
      this.setState({ Edit: false });
    } else if (this.state.EditResponseDepartment && this.state.EditResponseText) {
      /*
      If required fields are non-empty and have been
      modified, submit the client response through
      API and temporarily send the form into a loading
      state while waiting for a response from the API
      */
      this.putClientResponseFromAPI();
      this.setState({
        SubmitButtonLoading: true,
        FormLoading: true
      });
    }
  };

  editClientResponse = () => {
    // Send this component into edit state
    this.setState({
      EditResponseDepartment: this.state.ClientResponseData.Department,
      EditResponseText: this.state.ClientResponseData.Response,
      SubmitButtonLoading: false,
      FormLoading: false
    });
    this.setState({ Edit: true });
  };

  render = () => {

    if (this.state.Deleted) {
      /*
      If current client response has been deleted,
      then don't render this particular component
      */
      return (null);
    } else if (this.state.Edit) {
      /*
      If the component is in edit state,
      then show an editable form
      */
      return (
        <Form reply loading={ this.state.FormLoading }>
          <Form.Select label='Department' name='EditResponseDepartment' onChange={ this.handleChange }
                       onKeyPress={ this.handleKeyPress } value={ this.state.EditResponseDepartment }
                       options={ departmentFormOptions } placeholder='Your Department...' required/>
          <Form.TextArea label='Response' name='EditResponseText' onChange={ this.handleChange }
                         onKeyPress={ this.handleKeyPress } value={ this.state.EditResponseText }
                         placeholder='Your Response...' required/>
          <Button loading={ this.state.SubmitButtonLoading } content='Submit Client Response'
                  labelPosition='left' icon='edit' primary onClick={ this.handleSubmit }/>
        </Form>
      );
    } else {
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
          <Comment.Avatar src={ avatar }/>
          <Comment.Content>
            <Comment.Author
              as='a'>{ this.state.ClientResponseData.Department } ({ this.state.ClientResponseData.ResponseBy })</Comment.Author>
            <Comment.Metadata>Modified { readableModificationTime }</Comment.Metadata>
            <Comment.Text>{ this.state.ClientResponseData.Response }</Comment.Text>
            <Comment.Actions>
              <Comment.Action onClick={ this.editClientResponse }>Edit</Comment.Action>
              <Comment.Action onClick={ this.deleteClientResponseFromAPI }>Delete</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      );
    }
  }
}
