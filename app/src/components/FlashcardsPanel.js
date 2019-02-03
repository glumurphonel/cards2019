import React, { Component } from 'react'
import { Badge, Col, Row, Card, Button } from "react-bootstrap";

class FlashcardsPanel extends Component {

  render() {
    return (
      <div>
        {
          this.props.flashcards.length !== 0 
          ? this.props.flashcards.map(fc =>
            <div className='mb-4'>
              <h2>{this.props.header}</h2>
              <h3><a href={'/flashcard/' + fc.id}>{'Flashcard ' + fc.id}</a></h3>
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
