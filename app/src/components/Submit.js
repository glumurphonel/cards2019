import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

class Submit extends Component {

  render() {
    return (
      <div>
        <h1  className='mb-2'>Submit Flashcard</h1>
        <Form>
          <Form.Group controlId="submitForm.Question">
            <Form.Label>Question</Form.Label>
            <Form.Control as="textarea" rows="3" />
          </Form.Group>
        <Button type="submit">Submit</Button>
        </Form>
      </div>
    )
  }

}

export default Submit
