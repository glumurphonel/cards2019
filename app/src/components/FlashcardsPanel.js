import React, { Component } from 'react'
import { Badge, Col, Row, Card, Button } from "react-bootstrap";
import history from '../history'

class FlashcardsPanel extends Component {

  render() {
    return (
      <div>
        {
          this.props.flashcards.length !== 0 
          ? this.props.flashcards.map(fc =>
            <div className='mb-4'>
              {this.props.header ? <h2>{this.props.header}</h2> : null}
              <h3><a href={'/flashcard/' + fc.id} onClick={e => {e.preventDefault();history.push('/flashcard/' + fc.id)}}>{'Flashcard ' + fc.id}</a></h3>
              <ul className='mb-1'>
                {fc.questions.map(question =>
                  <li>
                    {question.qBody}
                  </li>
                )}
              </ul>
              <Badge pill variant="secondary" className='mr-1'>
                {fc.langName}
              </Badge>
              <Badge pill variant="secondary">
                {fc.catName}
              </Badge>            
            </div>
            )
          : null
        }
      </div>
    )
  }

}

export default FlashcardsPanel
