import React, { Component } from 'react'
import { Badge } from "react-bootstrap";

class FlashcardsPanel extends Component {

  render() {
    return (
      <div className='col-xs-12'>
        {
          this.props.flashcards.length !== 0 
          ? this.props.flashcards.map(fc =>
            <div>
              <h2>{this.props.header}</h2>
              <h3><a href={'/flashcard/' + fc.id}>{'Flashcard ' + fc.id}</a></h3>
              <ul>
              {fc.questions.map(question =>
                <li className='flashcard-questions'>{question.qBody}</li>
              )}
              </ul>
              <Badge pill variant="primary">
                {fc.langName}
              </Badge>
              <Badge pill variant="primary">
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
