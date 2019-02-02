//Contract/truffle components
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import flashcards_artifacts from './contracts/FlashCards.json'

class ContractOperations {
    constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask')
        // Use Mist/MetaMask's provider
        this.provider = window.web3.currentProvider
        this.web3 = new Web3(this.provider)
        this.ticketContract = contract(flashcards_artifacts)
        this.ticketContract.setProvider(this.provider)  
      } else {
        throw 'No web3 detected. please use MetaMask.'
      }
    }

  readAccount(callback) {
    var self = this;
    this.web3.eth.getCoinbase(function (err, account) {
      if (err != null) {
        alert('There was an error fetching your account.')
        console.log(err)
        return
      }

      if (account == null) {
        alert('Couldn\'t load account! Make sure your Ethereum client is configured correctly.')
        return
      }

      self.ticketContract.deployed().then(async (instance) => {
        let receipt = await instance.accountRegistered({ from: account })
        if (callback)
          callback({address: account, accountRegistered: receipt})
      })
    })
  }

  async registerAccount(account) {
    await this.ticketContract.deployed().then(async (instance) => {
      await instance.createAccount({ from: account })
    })
  }

  async getRegisteredAccounts() {
    var accounts
    await this.ticketContract.deployed().then(async (instance) => {
      accounts = await instance.getAllAccounts()
    })
    return accounts
  }

}
export default ContractOperations;
