import React, { Component } from 'react'
import FlashcardsPanel from './FlashcardsPanel'

class Flashcards extends Component {

  constructor(args) {
    super(args)
    this.state = {
      loading: true,
      account: {},
    }

    this.props.contractOperations.readAccount(account => {
      this.setState({ account: account })
    })
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>{this.props.header}</h1>
        <FlashcardsPanel account={this.state.account} flashcards={this.props.flashcards} contractOperations={this.props.contractOperations} />
      </div>
    )
  }
}

export default Flashcards
