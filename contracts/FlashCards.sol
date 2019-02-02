pragma solidity >=0.5.0<0.6.0;

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
  Language[] public langList;
  Category[] public categoryList;
  FlashCard[] public flashCardList;

  uint public allAccountsCount;
  mapping(address => AccountInfo) public allAccounts;
  address[] public allAccountAddresses;

  constructor() public {
    admin = msg.sender;
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

  event AccountCreated(uint _id, address _addr);

  function generateSampleLanguages() isAdmin() internal {
    uint curNum = langList.length;
    langList.push(Language({id: ++curNum, langName: "English"}));
    langList.push(Language({id: ++curNum, langName: "German"}));
    langList.push(Language({id: ++curNum, langName: "Russian"}));
  }

  function generateSampleCategories() isAdmin() internal {
    uint curNum = categoryList.length;
    categoryList.push(Category({id: ++curNum, catName: "Cooking"}));
    categoryList.push(Category({id: ++curNum, catName: "Travel"}));
    categoryList.push(Category({id: ++curNum, catName: "Drinking"}));
  }


  function generateVanillaPack() isAdmin() internal {
    uint curNum = flashCardList.length;
    uint qCounter = 0;
    /*
    Question[] memory tmp = new Question[](0);
    Question memory curQ = new Question[](0);


    curQ.id = ++qCounter;
    curQ.qBody = "Я нашел СуперСуса";
    //curQ.aList.push(Answer({id: 1, aBody: "I want to fuck SuperSus"}));
    //curQ.aList.push(Answer({id: 2, aBody: "I found SuperSus"}));
    curQ.aList = new Answer[](0);
    curQ.rightAnswer = 2;
    tmp.push(curQ);

    curQ.id = ++qCounter;
    curQ.qBody = "Я ебу Собак";
    curQ.aList.push(Answer({id: 1, aBody: "I hate dogs"}));
    curQ.aList.push(Answer({id: 2, aBody: "I fuck with dogs"}));
    curQ.aList.push(Answer({id: 3, aBody: "I love cats"}));
    curQ.rightAnswer = 3;
    tmp.push(curQ);
    */
    flashCardList.push(FlashCard({
          id : ++curNum,
            categoryId: 1,
            langId: 1,
            //questions: new Question[](0) ,
            numberOfQuestions: 0,
            usedCounter: 0,
            complCounter: 0,
            subm: msg.sender,
            aud: msg.sender
            }));
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

}
