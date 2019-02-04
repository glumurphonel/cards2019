import React, { Component } from 'react'
import { Badge, Col, Row, Card, Button } from "react-bootstrap";

class FlashcardsPanel extends Component {

  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      flashcard: undefined,
      answered: {}
    }

    this.loadFlashcard = this.loadFlashcard.bind(this)
    this.answer = this.answer.bind(this)
    this.getAnswerCardBackground = this.getAnswerCardBackground.bind(this)

    this.props.contractOperations.readAccount(account => {
      this.setState({ account: account })
      this.loadFlashcard()
    })
  }

  async loadFlashcard() {
    if (!this.state.account.address) {
      return
    }

    this.setState({flashcard: await this.props.contractOperations.getFlashcardInfo(this.props.match.params.number)})
    this.setState({loading: false})
  }

  answer(questionId, answerIndex) {
    let answered = this.state.answered
    answered[questionId] = answerIndex
    this.setState({answered:answered})
  }

  getAnswerCardBackground(question, currentAnswerIndex) {
    if(!this.state.answered.hasOwnProperty(question.id)) {
      return ''
    } 
    if (currentAnswerIndex === question.rightAnswer.toNumber() - 1) {
      return 'bg-success text-white'
    } else if (this.state.answered[question.id] === currentAnswerIndex) {
      return 'bg-danger text-white'
    }
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>Flashcard</h1>
        {
          this.state.account.accountRegistered
          ? this.state.loading
            ? <div>Loading...</div>
            : 
                this.state.flashcard.questions.map(question =>
                  <Row>
                    <Col xs={12}><h3 className='mb-3 mt-2'>{question.qBody}</h3></Col>
                    {question.answers.map((answer, i) =>
                      <Col xs={12} md={3} className='mb-2'>
                        <a href='#' onClick={() => this.answer(question.id, i)}>
                          <Card style={{ width: '100%' }} className={this.getAnswerCardBackground(question, i)}>
                            <Card.Body>
                              <Card.Text>
                                {answer}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </a>
                      </Col>
                    )}
                  </Row>
                )
          : <div>Please register your account</div>          
        }
      </div>
    )
  }

}

export default FlashcardsPanel
