import React, { Component } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { FaPlus, FaTimes } from 'react-icons/fa';

class Submit extends Component {

  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      languages: [],
      categories: [],
      language: 1,
      category: 1,
      questions: [{
        question: '',
        answers: [{}]
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
    this.handleLanguageChange = this.handleLanguageChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  addQuestion = evt => {
    let questions = this.state.questions
    questions.push({
      question: '',
      answers: [{}]
    });
    this.setState({questions:questions})
  }

  removeQuestion = (qId) => evt => {
    let questions = this.state.questions
    questions.splice(qId, 1)
    this.setState({questions:questions})
  }

  addAnswer = qId => evt => {
    let questions = this.state.questions
    questions[qId].answers.push({})
    this.setState({questions:questions})
  }

  removeAnswer = (qId, aId) => evt => {
    let questions = this.state.questions
    questions[qId].answers.splice(aId, 1)
    this.setState({questions:questions})
  }

  handleAnswerChange = (qId, aId) => evt => {
    let questions = this.state.questions
    questions[qId].answers[aId].answer = evt.target.value
    this.setState({questions:questions})
  }

  handleAnswerCorrect = (qId, aId) => evt => {
    let questions = this.state.questions
    if(questions[qId].answers[aId].correct) {
      questions[qId].answers[aId].correct = false
    } else {
      questions[qId].answers[aId].correct = true
    }
    questions[qId].answers.forEach((a,i) => {if(i!==aId){a.correct=false}})
    this.setState({questions:questions})
  }

  handleLanguageChange = idx => evt => {
    this.setState({language:evt.target.value})
  }

  handleCategoryChange = idx => evt => {
    this.setState({category:evt.target.value})
  }

  handleQuestionChange = idx => evt => {
    let questions = this.state.questions
    questions[idx].question = evt.target.value
    this.setState({questions:questions})
  }

  handleSubmit = evt => {
    evt.preventDefault();
    let qList = this.state.questions.map(q => q.question)
    let aList = this.state.questions.map(q => q.answers.map(a => a.answer)).flat(1)
    let iList = this.state.questions.map(q => q.answers.length)
    let rList = this.state.questions.map(q => q.answers.map((a,i) => {a.idx=i;return a}).filter(a => a.correct).map(a=>a.idx+1)).flat(1)
    this.props.contractOperations.submitFlashCard(this.state.category, this.state.language, qList, aList, iList, rList, this.state.account.address)
  }

  render() {
    var removeAnswerIconStyle = {
      position: 'absolute',
      left: 0,
      top: '50%',
      'margin-top': '-8px',
      cursor: 'pointer'
    }
    var addAnswerIconStyle = {
      cursor: 'pointer'
    }
    var removeQuestionIconStyle = {
      position: 'absolute',
      top: '8px',
      right: '8px',
      cursor: 'pointer'
    }
    return (
      <div>
        <h1  className='mb-2'>Submit Flashcard</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="submitForm.Language">
            <Form.Label>Language</Form.Label>
            <Form.Control as="select" onChange={this.handleLanguageChange} value={this.state.language}>
              {
                this.state.languages.map((a, i) =>
                  <option value={a.id}>{a.name}</option>
                )
              }
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="submitForm.Category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={this.handleCategoryChange} value={this.state.category}>
              {
                this.state.categories.map((a, i) =>
                  <option value={a.id}>{a.name}</option>
                )
              }
            </Form.Control>
          </Form.Group>
          <h2>Questions</h2>
          {this.state.questions.map((question, j) =>
            <Card className='mb-3'>
              <Card.Body>
                {j > 0 ? <FaTimes style={removeQuestionIconStyle} onClick={this.removeQuestion(j)} /> : null}
                <Form.Group controlId="submitForm.Question">
                  <Form.Label>Question</Form.Label>
                  <Form.Control as="textarea" rows="3" onChange={this.handleQuestionChange(j)} value={question.question} />
                </Form.Group>
                <Form.Group controlId="submitForm.Answers">
                  <Form.Label>Answers</Form.Label>
                  {
                    question.answers.map((a, i) =>
                      <Row className='mb-2'>
                        <Col>
                          <Form.Control as="input" className='float-left' onChange={this.handleAnswerChange(j, i)} value={a.answer} />
                        </Col>
                        <Col>
                          {question.answers.length > 1 && i > 0 ? <FaTimes style={removeAnswerIconStyle} onClick={this.removeAnswer(j, i)} /> : null}
                        </Col>
                        <Col xs={12}>
                          <Form.Check type="checkbox" label="Correct answer" onChange={this.handleAnswerCorrect(j, i)} checked={a.correct} />
                        </Col>
                      </Row>
                    )
                  }
                  <FaPlus style={addAnswerIconStyle} onClick={this.addAnswer(j)} />
                </Form.Group>
              </Card.Body>
            </Card>
          )}
          <div>
            <Button variant='secondary' type='button' onClick={e => this.addQuestion()} className='mr-1'>New question</Button>
            {this.state.questions.length > 0 ? <Button type="submit">Submit</Button> : null}
          </div>
        </Form>
      </div>
    )
  }

}

export default Submit
