import React, { Component } from 'react'
import FlashcardsPanel from './FlashcardsPanel'

class Flashcards extends Component {
  
  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
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

    this.setState({flashcards: await this.props.contractOperations.getSubmittedFlashcards(this.state.account.address)})
    this.setState({loading: false})
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>Flashcards</h1>
        {
          this.state.account.accountRegistered
          ? this.state.loading
            ? <div>Loading...</div>
            : <div>
                <FlashcardsPanel flashcards={this.state.flashcards} />
              </div>
          : <div>Please register your account</div>          
        }
      </div>
    )
  }
}

export default Flashcards
