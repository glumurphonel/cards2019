pragma solidity >=0.5.0<0.6.0;
pragma experimental ABIEncoderV2;

contract FlashCards {

  struct AccountInfo {
    address addr;
    bool exists;
    uint[] favFlashCards;
    uint[] subFlashCards;
    uint[] audFlashCards;
  }

  struct Answer {
    uint id;
    string aBody;
  }

  struct Question {
    uint id;
    string qBody;
    mapping(uint => Answer) answers;
    uint numberAnswers;
    uint rightAnswer;
  }

  struct Language {
    uint id;
    string langName;
  }

  struct Category {
    uint id;
    string catName;
  }

  struct FlashCard {
    uint id;
    uint categoryId;
    uint langId;
    uint usedCounter;
    uint complCounter;
    address subm;
    address aud;
    uint numberOfQuestions;
    mapping(uint => Question) questions;
  }

  address public admin;
  uint public langListCount;
  mapping(uint => Language) public langList;
  uint public categoryListCount;
  mapping(uint => Category) public categoryList;

  uint public numberOfFlashCards;
  mapping(uint => FlashCard) public flashCardList;

  uint public allAccountsCount;
  mapping(address => AccountInfo) public allAccounts;
  address[] public allAccountAddresses;

  constructor() public {
    admin = msg.sender;
    createAccount();
    generateSampleLanguages();
    generateSampleCategories();
    generateVanillaPack();
  }

  modifier isAdmin() {
    require(msg.sender == admin, "Not an admin");
    _;
  }

  modifier accountExists(address _addr) {
    require(allAccounts[_addr].exists == true, "Account doesn't exist");
    _;
  }

  modifier accountNotExists(address _addr) {
    require(allAccounts[_addr].exists == false, "Account already exists");
    _;
  }

  modifier flashCardExists(uint _tId) {
    require(flashCardList[_tId].id != 0, "Flash card does not exist!");
    _;
  }

  modifier flashCardNotExist(uint _tId) {
    require(flashCardList[_tId].id == 0, "Flash card already exists!");
    _;
  }


  event AccountCreated(uint _id, address _addr);
  event FlashCardSubmitted(uint _tId, address _addr);

  function generateSampleLanguages() isAdmin() internal {
    ++langListCount;
    langList[langListCount] = Language({id: langListCount, langName: "English"});
    ++langListCount;
    langList[langListCount] = Language({id: langListCount, langName: "German"});
    ++langListCount;
    langList[langListCount] = Language({id: langListCount, langName: "Russian"});
  }

  function generateSampleCategories() isAdmin() internal {
    ++categoryListCount;
    categoryList[categoryListCount] = Category({id: categoryListCount, catName: "Cooking"});
    ++categoryListCount;
    categoryList[categoryListCount] = Category({id: categoryListCount, catName: "Travel"});
    ++categoryListCount;
    categoryList[categoryListCount] = Category({id: categoryListCount, catName: "Drinking"});
  }

  function generateVanillaPack() isAdmin() internal {
    Question memory tmpQ1 = Question({
        id: 1,
          qBody: "Я нашел СуперСуса",
          numberAnswers: 2,
          rightAnswer: 2
          });

    Question memory tmpQ2 = Question({
        id: 2,
          qBody: "Я ебу Собак",
          numberAnswers: 3,
          rightAnswer: 2
          });

    FlashCard memory curFlash = FlashCard({
        id : ++numberOfFlashCards,
          categoryId: 1,
          langId: 1,
          numberOfQuestions: 2,
          usedCounter: 0,
          complCounter: 0,
          subm: msg.sender,
          aud: address(0)
          });

    flashCardList[numberOfFlashCards] = curFlash;
    flashCardList[numberOfFlashCards].questions[1] = tmpQ1;
    flashCardList[numberOfFlashCards].questions[2] = tmpQ2;
    flashCardList[numberOfFlashCards].questions[1].answers[1]
      = Answer({id: 1, aBody: "I want to fuck SuperSus"});
    flashCardList[numberOfFlashCards].questions[1].answers[2]
      = Answer({id: 2, aBody: "I found SuperSus"});
    flashCardList[numberOfFlashCards].questions[2].answers[1]
      = Answer({id: 1, aBody: "I hate dogs"});
    flashCardList[numberOfFlashCards].questions[2].answers[2]
      = Answer({id: 2, aBody: "I fuck with dogs"});
    flashCardList[numberOfFlashCards].questions[2].answers[3]
      = Answer({id: 3, aBody: "I love cats"});

    allAccounts[msg.sender].subFlashCards.push(1);
  }

  function createAccount() public accountNotExists(msg.sender) returns (uint _id) {
    allAccountsCount++;
    allAccountAddresses.push(msg.sender);
    allAccounts[msg.sender] = AccountInfo({
        addr: msg.sender,
          exists: true,
          favFlashCards: new uint[](0),
          subFlashCards: new uint[](0),
          audFlashCards: new uint[](0)
          });

    emit AccountCreated(allAccountsCount, msg.sender);
    return allAccountsCount;
  }

  function accountRegistered() public view returns (bool) {
    return allAccounts[msg.sender].exists == true;
  }

  function getSubmittedFlashcards(address _addr) public view accountExists(_addr) returns(uint[] memory) {
    uint submittedFlashCardsCount = allAccounts[_addr].subFlashCards.length;
    uint[] memory ids = new uint[](submittedFlashCardsCount);

    for (uint i = 0; i < submittedFlashCardsCount; i++) {
      ids[i] = allAccounts[_addr].subFlashCards[i];
    }
    return ids;
  }

  function getFavoriteFlashcards(address _addr)
    public view accountExists(_addr) returns(uint[] memory) {
    uint favoriteFlashCardsCount = allAccounts[_addr].favFlashCards.length;
    uint[] memory ids = new uint[](favoriteFlashCardsCount);

    for (uint i = 0; i < favoriteFlashCardsCount; i++) {
      ids[i] = allAccounts[_addr].favFlashCards[i];
    }
    return ids;
  }

  function getAuditedFlashcards(address _addr)
    public view accountExists(_addr) returns(uint[] memory) {
    uint auditedFlashCardsCount = allAccounts[_addr].audFlashCards.length;
    uint[] memory ids = new uint[](auditedFlashCardsCount);

    for (uint i = 0; i < auditedFlashCardsCount; i++) {
      ids[i] = allAccounts[_addr].audFlashCards[i];
    }
    return ids;
  }

  function getAllFlashcards() public view returns(uint[] memory) {
    uint[] memory ids = new uint[](numberOfFlashCards);
    for (uint i = 1; i <= numberOfFlashCards; i++) {
      ids[i-1] = flashCardList[i].id;
    }
    return ids;
  }

  function addFlashCardToFav(uint _fId)
    public accountExists(msg.sender) flashCardExists(_fId) {
    require(isFlashCardInFav(_fId) == false, "Already in fav!");
    flashCardList[_fId].usedCounter++;
    allAccounts[msg.sender].favFlashCards.push(_fId);
  }

  function isFlashCardInFav(uint _fId)
    public view returns (bool) {
    uint favCardsCount = allAccounts[msg.sender].favFlashCards.length;

    for (uint i = 0; i < favCardsCount; i++) {
      if(allAccounts[msg.sender].favFlashCards[i] == _fId)
        return true;
    }
    return false;
  }

  function addFlashCardToAud(uint _fId)
    public accountExists(msg.sender) flashCardExists(_fId) {
    require(isFlashCardInAud(_fId) == false, "Already in aud!");
    flashCardList[_fId].aud = msg.sender;
    allAccounts[msg.sender].audFlashCards.push(_fId);
  }

  function isFlashCardInAud(uint _fId)
    public view returns (bool) {
    return flashCardList[_fId].aud != address(0);
  }

  function getFlashcardInfoById(uint _tId) public view returns (uint, string memory, uint, string memory, uint, uint, address, address, uint) {
    FlashCard memory fc = flashCardList[_tId];
    return (fc.categoryId, categoryList[fc.categoryId].catName, fc.langId, langList[fc.langId].langName, fc.usedCounter,
            fc.complCounter, fc.subm, fc.aud, fc.numberOfQuestions);
  }

  function getQuestionInfoById(uint _fcId, uint _qId) public view returns (string memory, uint, uint) {
    return (flashCardList[_fcId].questions[_qId].qBody, flashCardList[_fcId].questions[_qId].numberAnswers,
      flashCardList[_fcId].questions[_qId].rightAnswer);
  }

  function getAnswerBodyById(uint _tId, uint _qId, uint _ansId) public view returns(string memory){
    return(flashCardList[_tId].questions[_qId].answers[_ansId].aBody);
  }

  function getCategoryById(uint _cId) public view returns(uint, string memory){
    return(categoryList[_cId].id, categoryList[_cId].catName);
  }

  function getCategoryIds() public view returns(uint[] memory) {
    uint[] memory ids = new uint[](categoryListCount);
    for (uint i = 1; i <= categoryListCount; i ++) {
      ids[i - 1] = categoryList[i].id;
    }
    return ids;
  }

  function getLanguageById(uint _lId) public view returns(uint, string memory){
    return(langList[_lId].id, langList[_lId].langName);
  }

  function getLanguageIds() public view returns(uint[] memory) {
    uint[] memory ids = new uint[](langListCount);
    for (uint i = 1; i <= langListCount; i ++) {
      ids[i - 1] = langList[i].id;
    }
    return ids;
  }

  function submitFlashCard(uint _cat, uint _lang, string[] memory _qList, string[] memory _aList, uint[] memory _iList, uint[] memory _rAns)
    public accountExists(msg.sender) returns(uint) {
    // TODO: preliminary checks
    ++numberOfFlashCards;
    flashCardList[numberOfFlashCards] = FlashCard({
        id : numberOfFlashCards,
          categoryId: _cat,
          langId: _lang,
          numberOfQuestions: _qList.length,
          usedCounter: 0,
          complCounter: 0,
          subm: msg.sender,
          aud: address(0)
          });

    // adding questions
    for(uint i=0; i<_qList.length; i++){
      uint _end = i + _iList[i];
      flashCardList[numberOfFlashCards].questions[(i+1)] = Question({
          id: (i+1),
            qBody: _qList[i],
            numberAnswers: _iList[i],
            rightAnswer: _rAns[i]
            });
      // adding answers
      for(uint j=i; j<_end; j++){
        flashCardList[numberOfFlashCards].questions[(i+1)].answers[(j+1)] = Answer({id:(j+1) , aBody: _aList[j]});
      }
    }
    allAccounts[msg.sender].subFlashCards.push(numberOfFlashCards);
    emit FlashCardSubmitted(numberOfFlashCards, msg.sender);
    return numberOfFlashCards;
  }

}
