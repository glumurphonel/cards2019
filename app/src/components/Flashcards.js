import React, { Component } from 'react'
import FlashcardsPanel from './FlashcardsPanel'

class Flashcards extends Component {
  
  constructor(args) {
    super(args)
    this.state = {
      account: {},
      loading: true,
      submittedFlashcards: [],
      favoriteFlashcards: [],
      notAuditedFlashcards: [],
      auditedFlashcards: []
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

    let submittedFlashcards = await this.props.contractOperations.getSubmittedFlashcards(this.state.account.address)
    let favoriteFlashcards = await this.props.contractOperations.getFavoriteFlashcards(this.state.account.address)
    let auditedFlashcards = await this.props.contractOperations.getAuditedFlashcards(this.state.account.address)
    let notAuditedFnashcards = await this.props.contractOperations.getNotAuditedFlashcards(this.state.account.address)
    this.setState({submittedFlashcards: submittedFlashcards})
    this.setState({favoriteFlashcards: favoriteFlashcards})
    this.setState({auditedFlashcards: auditedFlashcards})
    this.setState({notAuditedFnashcards: notAuditedFnashcards})
    this.setState({loading: false})
  }

  render() {
    return (
      <div>
        <h1  className='mb-2'>My Flashcards</h1>
        {
          this.state.account.accountRegistered
          ? this.state.loading
            ? <div>Loading...</div>
            : <div>
                <FlashcardsPanel header='Submitted Flashcards' flashcards={this.state.submittedFlashcards} />
                <FlashcardsPanel header='Favorite Flashcards' flashcards={this.state.favoriteFlashcards} />
                <FlashcardsPanel header='Audited Flashcards' flashcards={this.state.auditedFlashcards} />
                <FlashcardsPanel header='Not Audited Flashcards' flashcards={this.state.notAuditedFlashcards} />
              </div>
          : <div>Please register your account</div>          
        }
      </div>
    )
  }
}

export default Flashcards
