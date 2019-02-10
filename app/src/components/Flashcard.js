import React, { Component } from 'react'
import { Badge, Col, Row, Card, Button, Modal } from "react-bootstrap";
import { FaStar, FaRegStar } from 'react-icons/fa';

class FlashcardsPanel extends Component {

  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      flashcard: undefined,
      answered: {},
      showRateModal: false,
      rate: 0
    }

    this.loadFlashcard = this.loadFlashcard.bind(this)
    this.answer = this.answer.bind(this)
    this.getAnswerCardBackground = this.getAnswerCardBackground.bind(this)
    this.handleShowRateModal = this.handleShowRateModal.bind(this)
    this.handleHideRateModal = this.handleHideRateModal.bind(this)

    this.props.contractOperations.readAccount(account => {
      this.setState({ account: account })
      this.loadFlashcard()
    })
  }

  async flashcardRated() {
    if (!this.state.account.address) {
      return
    }

    this.setState({rate: await this.props.contractOperations.getFlashCardRate(this.state.flashcard.id, this.state.account.address)})   
  }

  async loadFlashcard() {
    if (!this.state.account.address) {
      return
    }

    this.setState({flashcard: await this.props.contractOperations.getFlashcardInfo(this.props.match.params.number)})
    this.setState({loading: false})
    this.flashcardRated()
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

  handleShowRateModal() {
    this.setState({ showRateModal: true });
  }

  handleHideRateModal() {
    this.setState({ showRateModal: false });
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>Flashcard</h1>
        {
          this.state.account.accountRegistered
          ? this.state.loading
            ? <div>Loading...</div>
            : <Row>
                <Col xs={12}>
                {this.state.flashcard.questions.map(question =>
                  <Row>
                    <Col xs={12}><h3 className='mb-3 mt-2'>{question.qBody}</h3></Col>
                    {question.answers.map((answer, i) =>
                      <Col xs={12} md={3} className='mb-2'>
                        <a href='#' onClick={e => {e.preventDefault();this.answer(question.id, i)}}>
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
                )}
                </Col>
              <Col xs={12}>
                {
                  this.state.flashcard.aud === '' && this.state.flashcard.subm !== this.state.account.address
                  ? <Button className='mt-2 mr-1' variant="secondary" onClick={() => {this.props.contractOperations.addFlashCardToAud(this.state.account.address, this.state.flashcard.id).then(() => this.loadFlashcard())}}>Audit</Button>
                  : null
                }
                {
                  this.state.rate === 0 && this.state.flashcard.subm !== this.state.account.address
                  ? <>
                    <Button className='mt-2 mr-1' variant="secondary" onClick={this.handleShowRateModal}>Rate</Button>
                    <Modal show={this.state.showRateModal} onHide={this.handleHideRateModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Rate Flashcard</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div>
                          {
                            Array.apply(null, Array(5)).map(n=> 
                              <a href='#'><FaRegStar className='mr-1'  /></a>
                            )
                          }
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                      </Modal.Footer>
                    </Modal>
                  </>        
                  : null
                }
              </Col>
           </Row>
          : <div>Please register your account</div>          
        }
      </div>
    )
  }

}

export default FlashcardsPanel
