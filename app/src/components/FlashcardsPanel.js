import React, { Component } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Badge, Col, Row, Card, Button } from "react-bootstrap"
import history from '../history'

class FlashcardsPanel extends Component {

  constructor(args) {
    super(args)
    this.state = {
    }

    this.addTofavorites = this.addTofavorites.bind(this)
  }

  addTofavorites(i) {
    let fc = this.props.flashcards[i]
    this.props.contractOperations.addFlashCardToFav(this.props.account.address, fc.id).then(() =>{
      fc.favorite = true
      fc.usedCounter++
      this.forceUpdate()
    })
  }

  render() {
    return (
      <div>
        {
          this.props.flashcards.length !== 0 
          ? this.props.flashcards.map((fc, i) =>
            <div className='mb-4'>
              {this.props.header ? <h2>{this.props.header}</h2> : null}
              <div className='clearfix'>
                <h3 className='float-left'>
                  <a href={'/flashcard/' + fc.id} onClick={e => {e.preventDefault();history.push('/flashcard/' + fc.id)}}>{'Flashcard ' + fc.id}</a>
                </h3>
                <span className='float-left mt-1 ml-1'>
                  {!fc.favorite ? <a href='#' onClick={e=>{e.preventDefault();this.addTofavorites(i)}}><FaRegStar /></a> : <FaStar />}
                </span>
              </div>
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
              <Badge pill variant="secondary" className='mr-1'>
                {fc.catName}
              </Badge>
              <Badge pill variant="secondary" className='mr-1'>
                Liked {fc.usedCounter.toString()} times
              </Badge>
            </div>
            )
          : <div>No Flashcards found</div>
        }
      </div>
    )
  }

}

export default FlashcardsPanel
