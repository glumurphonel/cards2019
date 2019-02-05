import React, { Component } from 'react'
import FlashcardsPanel from './FlashcardsPanel'

class Flashcards extends Component {

  constructor(args) {
    super(args)
    this.state = {
      loading: true,
      account: {},
      flashcards: []
    }

    this.loadFlashcards = this.loadFlashcards.bind(this)
    this.props.contractOperations.readAccount(account => {
      this.setState({ account: account })
      this.loadFlashcards()
    })
  }
  
  async loadFlashcards() {
    if (!this.state.account.address) {
      return
    }

    let pathname = window.location.pathname
    var flashcards

    switch (pathname) {
      case '/favorites':
        flashcards = await this.props.contractOperations.getFavoriteFlashcards(this.state.account.address)
        break
      case '/submitted':
        flashcards = await this.props.contractOperations.getSubmittedFlashcards(this.state.account.address)
        break
      default:
        flashcards = await this.props.contractOperations.getSubmittedFlashcards(this.state.account.address)
    }
    this.setState({flashcards: flashcards})
    this.setState({loading: false})
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>{this.props.header}</h1>
        {
          <FlashcardsPanel account={this.state.account} flashcards={this.state.flashcards} contractOperations={this.props.contractOperations} />
        }
      </div>
    )
  }
}

export default Flashcards
