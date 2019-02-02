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
        this.contract = contract(flashcards_artifacts)
        this.contract.setProvider(this.provider)  
      } else {
        throw 'No web3 detected. please use MetaMask.'
      }
    }

  readAccount(callback) {
    var self = this;
    this.web3.eth.getCoinbase(function (err, account) {
      if (err) {
        alert('There was an error fetching your account.')
        console.log(err)
        return
      }

      if (account == null) {
        alert('Couldn\'t load account! Make sure your Ethereum client is configured correctly.')
        return
      }

      self.contract.deployed().then(async (instance) => {
        let receipt = await instance.accountRegistered({ from: account })
        if (callback)
          callback({address: account, accountRegistered: receipt})
      })
    })
  }

  async registerAccount(account) {
    await this.contract.deployed().then(async (instance) => {
      await instance.createAccount({ from: account })
    })
  }

  async getRegisteredAccounts() {
    var accounts
    await this.contract.deployed().then(async (instance) => {
      accounts = await instance.getAllAccounts()
    })
    return accounts
  }

  async getSubmittedFlashcards(account) {
    var self = this
    var flashcards = []
    await self.contract.deployed().then(async (instance) => {
      let flashcardIds = await instance.getSubmittedFlashcards(account)
      for (var i = 0; i < flashcardIds.length; i ++) {
        flashcardIds.push(await self.getFlashcardInfo(flashcardIds[i]))
      }
    })
    return flashcards
  }

  async getFavoriteFlashcards(account) {
    var self = this
    var flashcards = []
    await self.contract.deployed().then(async (instance) => {
      let flashcardIds = await instance.getFavoriteFlashcards(account)
      for (var i = 0; i < flashcardIds.length; i ++) {
        flashcardIds.push(await self.getFlashcardInfo(flashcardIds[i]))
      }
    })
    return flashcards
  }

  async getAuditedFlashcards(account) {
    var self = this
    var flashcards = []
    await self.contract.deployed().then(async (instance) => {
      let flashcardIds = await instance.getAuditedFlashcards(account)
      for (var i = 0; i < flashcardIds.length; i ++) {
        flashcardIds.push(await self.getFlashcardInfo(flashcardIds[i]))
      }
    })
    return flashcards
  }

  async getNotAuditedFlashcards(account) {
    var self = this
    var flashcards = []
    await self.contract.deployed().then(async (instance) => {
      // let flashcardIds = await instance.getSubmittedFlashcards(account)
      // for (var i = 0; i < flashcardIds.length; i ++) {
      //   flashcardIds.push(await self.getFlashcardInfo(flashcardIds[i]))
      // }
    })
    return flashcards
  }

  async getFlashcardInfo(id) {
    var flashcardObj;
    await this.contract.deployed().then(async (instance) => {
      const flashcard = await instance.getFlashcardInfo(id)
      flashcardObj = {
        id: id,
        categoryId: flashcard[0],
        langId: flashcard[1],
        usedCounter: flashcard[2],
        complCounter: flashcard[3],
        subm: flashcard[4],
        aud: flashcard[5],
        numberOfQuestions: flashcard[6]
      }
    })
    return flashcardObj;
  }
}
export default ContractOperations;
