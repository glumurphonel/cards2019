import React, { Component } from 'react'

class Tickets extends Component {
  
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
    this.renderFlashcardsByList = this.renderFlashcardsByList.bind(this)
    this.renderAllFlashcards = this.renderAllFlashcards.bind(this)

    this.props.contractOperations.readAccount(account => {
      this.setState({ account: account })
      this.loadFlashcards()
    })
  }

  loadFlashcards() {
    if (!this.state.account.address) {
      return
    }
    this.props.contractOperations.getSubmittedFlashcards(this.state.account.address).then(flashcards => {
      this.setState({submittedFlashcards: flashcards})
      this.props.contractOperations.getFavoriteFlashcards(this.state.account.address).then(flashcards => {
        this.setState({favoriteFlashcards: flashcards})
        this.props.contractOperations.getAuditedFlashcards(this.state.account.address).then(flashcards => {
          this.setState({auditedFlashcards: flashcards})
          this.props.contractOperations.getNotAuditedFlashcards(this.state.account.address).then(flashcards => {
            this.setState({NotAuditedFnashcards: flashcards, loading: false})
          })
        })
      })
    })
  }

  renderAllFlashcards() {
    let flasshcardsHtml = this.renderFlashcardsByList('Submitted Flashcards', this.state.submittedFlashcards)
      + this.renderFlashcardsByList('Favorite Flashcards', this.state.favoriteFlashcards)
      + this.renderFlashcardsByList('Audited Flashcards', this.state.auditedFlashcards)
      + this.renderFlashcardsByList('Not Audited Flashcards', this.state.notAuditedFlashcards)

    return flasshcardsHtml === '' ? <div className='col-xs-12'>No Flashcards found</div> : flasshcardsHtml
  }

  renderFlashcardsByList(header, flashcards) {
    if (flashcards.length === 0) {
      return ''
    }
    return <div className='col-xs-12'>{header}</div> +
      flashcards.map(flashcard =>
        <div className='col-xs-12'>
          <h3><a href={'/flashcard/' + flashcard.id}>{flashcard.title}</a></h3>
          <p className='flashcard-question'>{flashcard.question}</p>
        </div>
      )
  }

  render() {
    return (
      <div className='row text-left'>
        <h1 className='col-xs-12'>My Flashcards</h1>
        {
          this.state.account.accountRegistered
          ? this.state.loading
            ? <div className='col-xs-12'>Loading...</div>
            : this.renderAllFlashcards()
          : <div className='col-xs-12'>Please register your account</div>          
        }
      </div>
    )
  }
}

export default Tickets
