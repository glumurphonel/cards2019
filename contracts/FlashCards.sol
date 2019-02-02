pragma solidity >=0.5.0<0.6.0;

contract FlashCards {
  address public admin;

  Language[] public langList;
  Category[] public categoryList;
  FlashCard[] public flashCardList;

  struct Answer {
    uint id;
    string aBody;
  }

  struct Question {
    uint id;
    string qBody;
    Answer[] aList;
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
    Question[] questions;
    uint usedCounter;
    uint complCounter;
    address subm;
    address aud;
  }


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


  function generateVanillaPack() public {
    uint curNum = flashCardList.length;
    /* flashCardList.push(FlashCard({ */
    /*       id : ++curNum, */
    /*         categoryId: 1, */
    /*         langId: 1, */
    /*         questions: new uint */
    /*     })); */
    /*     uint id; */
    /* uint categoryId; */
    /* uint langId; */
    /* string[] questions; */
    /* string[] answers; */
    /* uint usedCounter; */
    /* uint complCounter; */
    /* address subm; */
    /* address aud; */
  }


}
