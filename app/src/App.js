import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Child Components
import Header from './components/Header'
import Footer from './components/Footer'
import MyFlashcards from './components/MyFlashcards'
import Flashcards from './components/Flashcards'
import Flashcard from './components/Flashcard'

import ContractOperations from './ContractOperations'
import { Switch, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

class App extends Component {

  constructor(args) {
    super(args)
    this.state = {
      loading: true,
      account: {}
    }

    this.registerAccount = this.registerAccount.bind(this)
  }

  UNSAFE_componentWillMount() {
    try {
      this.contractOperations = new ContractOperations(window.web3);
      this.contractOperations.readAccount(account => {
        this.setState({ account: account })
      })
    } catch (e) {
      alert(e)
    }
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
                <Route exact path='/' render={(props) => <Flashcards contractOperations={this.contractOperations} {...props} />} />
                <Route exact path='/my' render={(props) => <MyFlashcards contractOperations={this.contractOperations} {...props} />} />
                <Route path='/flashcard/:number' render={(props) => <Flashcard contractOperations={this.contractOperations} {...props} />} />
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
