import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import history from './history'

// Child Components
import Header from './components/Header'
import Footer from './components/Footer'
import Flashcards from './components/Flashcards'
import Flashcard from './components/Flashcard'
import Submit from './components/Submit'

import ContractOperations from './ContractOperations'
import { Switch, Route } from 'react-router-dom'
import { Container, Tab, Col, Row, Nav } from 'react-bootstrap'

class App extends Component {

  constructor(args) {
    super(args)
    this.state = {
      loading: true,
      account: {},
      flashcards: []
    }

    this.registerAccount = this.registerAccount.bind(this)
    this.loadFlashcards = this.loadFlashcards.bind(this)
  }

  UNSAFE_componentWillMount() {
    try {
      this.contractOperations = new ContractOperations(window.web3);
      this.contractOperations.readAccount(account => {
        this.setState({ account: account })
        this.loadFlashcards()
        this.contractOperations.provider.publicConfigStore.on('update', (data)=>{
          if(data.selectedAddress !== this.state.account.address) {
            window.location.reload(false)
          }
        })
      })
    } catch (e) {
      alert(e)
    }
  }
  
  async loadFlashcards() {
    if (!this.state.account.address) {
      return
    }

    let pathname = window.location.pathname
    var flashcards

    switch (pathname) {
      case '/favorites':
        flashcards = await this.contractOperations.getFavoriteFlashcards(this.state.account.address)
        break
      case '/submitted':
        flashcards = await this.contractOperations.getSubmittedFlashcards(this.state.account.address)
        break
      default:
        flashcards = await this.contractOperations.getSubmittedFlashcards(this.state.account.address)
    }
    this.setState({flashcards: flashcards})
    this.setState({loading: false})
  }

  registerAccount(e) {
    if (e) e.preventDefault()
    this.contractOperations.registerAccount(this.state.account.address).then(() => {
      var account = this.state.account
      account.accountRegistered = true
      this.setState({account:account})
    });
  }

  render() {
    return (
      <div className='App'>
        <Header
          contractOperations={this.contractOperations}
          account={this.state.account}
          registerAccount={this.registerAccount.bind(this)} />
        <Container className='mt-2'>
          {
            this.state.account.accountRegistered
            ? <Switch>
                <Route exact path='/' render={(props) => <Flashcards contractOperations={this.contractOperations} header='Audited Flashcards' {...props} />} />
                <Route exact path='/favorites' render={(props) => <Flashcards contractOperations={this.contractOperations} header='My Favorite Flashcards' {...props} />} />
                <Route exact path='/submitted' render={(props) => <Flashcards contractOperations={this.contractOperations} header='My Submitted Flashcards' {...props} />} />
                <Route path='/flashcard/:number' render={(props) => <Flashcard contractOperations={this.contractOperations} {...props} />} />
                <Route path='/submit' render={(props) => <Submit contractOperations={this.contractOperations} {...props} />} />
              </Switch>
            : <div>Please register your account</div>
          }
        </Container>
        <Footer />
      </div>
    )
  }
}

export default App;
