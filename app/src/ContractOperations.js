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
    var flashcards
    await this.contract.deployed().then(async (instance) => {
      flashcards = await this.createFlashcardList(await instance.getSubmittedFlashcards(account), account, instance)
    })
    return flashcards
  }

  async getFavoriteFlashcards(account) {
    var flashcards
    await this.contract.deployed().then(async (instance) => {
      flashcards = await this.createFlashcardList(await instance.getFavoriteFlashcards(account), account, instance)
    })
    return flashcards
  }

  async getAuditedFlashcards(account) {
    var flashcards
    await this.contract.deployed().then(async (instance) => {
      flashcards = await this.createFlashcardList(await instance.getAllFlashcards(), account, instance)
    })
    return flashcards.sort((a,b) => a.usedCounter-b.usedCounter).filter(f => f.aud !== '')
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

  async createFlashcardList(flashcardIds, account, instance) {
    let flashcards = []
    let favoriteIds = await instance.getFavoriteFlashcards(account)
    for (let i = 0; i < flashcardIds.length; i ++) {
      let id = flashcardIds[i]
      let flashcard = await this.getFlashcardInfo(id)

      if (favoriteIds.map(f=>f.toNumber()).includes(id.toNumber())) {
        flashcard.favorite = true
      }
      flashcards.push(flashcard)
    }
    return flashcards
  }

  async getFlashcardInfo(id) {
    var flashcardObj;
    await this.contract.deployed().then(async (instance) => {
      const flashcard = await instance.getFlashcardInfoById(id)
      flashcardObj = {
        id: id,
        categoryId: flashcard[0],
        catName: flashcard[1],
        langId: flashcard[2],
        langName: flashcard[3],
        usedCounter: flashcard[4],
        complCounter: flashcard[5],
        subm: flashcard[6],
        aud: flashcard[7] === '0x0000000000000000000000000000000000000000' ? '' : flashcard[7],
        numberOfQuestions: flashcard[8],
        questions: await this.getQuestions(instance, id, flashcard[8])
      }
    })
    return flashcardObj;
  }

  async getQuestions(instance, flashcardId, numberOfQuestions) {
    var questions = []
    for (let i = 1; i <= numberOfQuestions; i++) {
      const question = await instance.getQuestionInfoById(flashcardId, i)
      let questionObj = ({
        id: i,
        qBody: question[0],
        numberAnswers: question[1],
        rightAnswer: question[2]
      })
      let answers = []
      for (let j = 1; j <= questionObj.numberAnswers; j++) {
        answers.push(await instance.getAnswerBodyById(flashcardId, i, j))
      }
      questionObj.answers = answers
      questions.push(questionObj)
    }
    return questions
  }

  async addFlashCardToFav(account, id) {
    await this.contract.deployed().then(async (instance) => {
      await instance.addFlashCardToFav(id, { from: account })
    })
  }

  async addFlashCardToAud(account, id) {
    await this.contract.deployed().then(async (instance) => {
      await instance.addFlashCardToAud(id, { from: account })
    })
  }

  async getCategories() {
    var categories = []
    await this.contract.deployed().then(async (instance) => {
      var categoryIds = await instance.getCategoryIds()
      for (let i = 0; i < categoryIds.length; i ++) {
        let category = await instance.getCategoryById(categoryIds[i])
        categories.push({id: category[0], name: category[1]})
      }
    })
    return categories
  }

  async getLanguages() {
    var languages = []
    await this.contract.deployed().then(async (instance) => {
      var languageIds = await instance.getLanguageIds()
      for (let i = 0; i < languageIds.length; i ++) {
        let language = await instance.getLanguageById(languageIds[i])
        languages.push({id: language[0], name: language[1]})
      }
    })
    return languages
  }

}

export default ContractOperations;
