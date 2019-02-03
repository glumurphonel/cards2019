import React, { Component } from 'react'

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
              <p className='flashcard-questions'>{JSON.stringify(fc)}</p>
            </div>
            )
          : null
        }
      </div>
    )
  }

}

export default FlashcardsPanel
