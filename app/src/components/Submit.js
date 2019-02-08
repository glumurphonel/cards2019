import React, { Component } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { FaPlus, FaMinus } from 'react-icons/fa';

class Submit extends Component {

  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      answers: [''],
      languages: [],
      language: 1,
      categories: [],
      category: 1
    }

    this.props.contractOperations.readAccount(async account => {
      this.setState({ account: account })
      this.setState({languages: await this.props.contractOperations.getLanguages(), categories: await this.props.contractOperations.getCategories()});
    })
  }

  addAnswer() {
    let answers = this.state.answers
    answers.push('');
    this.setState({answers: answers})
  }

  removeAnswer(i) {
    let answers = this.state.answers
    answers.splice(i, 1);
    this.setState({answers: answers})
  }

  handleAnswerChange = idx => evt => {
    let answers = this.state.answers
    answers[idx] = evt.target.value
    this.setState({answers: answers})
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>Submit Flashcard</h1>
        <Form>
        <Form.Group controlId="submitForm.Language">
            <Form.Label>Language</Form.Label>
            <Form.Control as="select" onChange={e => this.setState({language:e.target.value})} value={this.state.language}>
            {
              this.state.languages.map((a, i) =>
                <option value={a.id}>{a.name}</option>
              )
            }
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="submitForm.Category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={e => this.setState({category:e.target.value})} value={this.state.category}>
            {
              this.state.categories.map((a, i) =>
                <option value={a.id}>{a.name}</option>
              )
            }
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="submitForm.Question">
            <Form.Label>Question</Form.Label>
            <Form.Control as="textarea" rows="3" onChange={e => this.setState({question:e.target.value})} value={this.state.question} />
          </Form.Group>
          <Form.Group controlId="submitForm.Answers">
            <Form.Label>Answers</Form.Label>
            {
              this.state.answers.map((a, i) =>
                <Row className='mb-1 clearfix'>
                  <Col>
                    <Form.Control as="input" className='float-left' onChange={this.handleAnswerChange(i)} value={a} />
                  </Col>
                  <Col>
                    {this.state.answers.length > 1 && i > 0 ? <FaMinus onClick={e => this.removeAnswer(i)} className='float-left mt-2' /> : null}
                  </Col>
                </Row>
              )
            }
            <FaPlus onClick={e => this.addAnswer()} />
          </Form.Group>
        <Button type="submit">Submit</Button>
        </Form>
      </div>
    )
  }

}

export default Submit
