import React, { Component } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { FaPlus, FaMinus } from 'react-icons/fa';

class Submit extends Component {

  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      languages: [],
      categories: [],
      questions: [{
        question: '',
        answers: [''],
        language: 1,
        category: 1
      }]
    }
    this.props.contractOperations.readAccount(async account => {
      this.setState({ account: account })
      this.setState({languages: await this.props.contractOperations.getLanguages(), categories: await this.props.contractOperations.getCategories()});
    })
    this.addQuestion = this.addQuestion.bind(this)
    this.addAnswer = this.addAnswer.bind(this)
    this.removeAnswer = this.removeAnswer.bind(this)
    this.handleAnswerChange = this.handleAnswerChange.bind(this)

  }

  addQuestion = evt => {
    let questions = this.state.questions
    questions.push({
      question: '',
      answers: [''],
      language: 1,
      category: 1
    });
    this.setState({questions:questions})
  }

  addAnswer = qId => evt => {
    let questions = this.state.questions
    questions[qId].answers.push('')
    this.setState({questions:questions})
  }

  removeAnswer = (qId, aId) => evt => {
    let questions = this.state.questions
    questions[qId].answers.splice(aId, 1)
    this.setState({questions:questions})
  }

  handleAnswerChange = (qId, aId) => evt => {
    let questions = this.state.questions
    questions[qId].answers[aId] = evt.target.value
    this.setState({questions:questions})
  }

  handleLanguageChange = idx => evt => {
    let questions = this.state.questions
    questions[idx].language = evt.target.value
    this.setState({questions:questions})
  }

  handleCategoryChange = idx => evt => {
    let questions = this.state.questions
    questions[idx].category = evt.target.value
    this.setState({questions:questions})
  }

  handleQuestionChange = idx => evt => {
    let questions = this.state.questions
    questions[idx].question = evt.target.value
    this.setState({questions:questions})
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>Submit Flashcard</h1>
        <Form>
          {this.state.questions.map((question, j) =>
            <Card className='mb-3'>
              <Card.Body>
                <Form.Group controlId="submitForm.Language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control as="select" onChange={this.handleLanguageChange(j)} value={question.language}>
                  {
                    this.state.languages.map((a, i) =>
                      <option value={a.id}>{a.name}</option>
                    )
                  }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="submitForm.Category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" onChange={this.handleCategoryChange(j)} value={question.category}>
                  {
                    this.state.categories.map((a, i) =>
                      <option value={a.id}>{a.name}</option>
                    )
                  }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="submitForm.Question">
                  <Form.Label>Question</Form.Label>
                  <Form.Control as="textarea" rows="3" onChange={this.handleQuestionChange(j)} value={question.question} />
                </Form.Group>
                <Form.Group controlId="submitForm.Answers">
                  <Form.Label>Answers</Form.Label>
                  {
                    question.answers.map((a, i) =>
                      <Row className='mb-1 clearfix'>
                        <Col>
                          <Form.Control as="input" className='float-left' onChange={this.handleAnswerChange(j, i)} value={a} />
                        </Col>
                        <Col>
                          {question.answers.length > 1 && i > 0 ? <FaMinus onClick={this.removeAnswer(j, i)} className='float-left mt-2' /> : null}
                        </Col>
                      </Row>
                    )
                  }
                  <FaPlus onClick={this.addAnswer(j)} />
                </Form.Group>
              </Card.Body>
            </Card>
          )}
          <div>
            <Button variant='secondary' onClick={e => this.addQuestion()} className='mr-1'>New question</Button>
            {this.state.questions.length > 0 ? <Button type="submit">Submit</Button> : null}
          </div>
        </Form>
      </div>
    )
  }

}

export default Submit
