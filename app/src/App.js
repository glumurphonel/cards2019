import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Child Components
import Header from './components/Header'
import Footer from './components/Footer'

import ContractOperations from './ContractOperations'

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
        <div className='container'>
          {
            this.state.account.accountRegistered
            ? null
            : <div>Please register your account</div>
          }
        </div>
        <Footer />
      </div>
    )
  }
}

export default App;
