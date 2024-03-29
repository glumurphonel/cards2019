var FlashCards = artifacts.require("FlashCards");
var tId = undefined;

contract('FlashCards', function(accounts) {
  var admin = accounts[0];
  var ethAmount = 5200000000000000;
  var smallEthAmount = 1;
  let tCore;
  let accNoFunds = web3.eth.accounts.create('test123');

  beforeEach('Setup contract for each test', async () => {
    fCore = await FlashCards.new();
    let qList = [ "Ясос Биба наш гейрой", "Да да я да"];
    let aList = [ "I suck penis as a hero", "I am muslim and I am proud of it", "yasos biba is our hero!",
                  "Yes I am yes", "I give up"];
    let iList = [ 3, 2]; // number of answers for each question
    let rList = [3, 1]; // right answers, 1<->n

    let fSub = await fCore.submitFlashCard(2, 3, qList.join('//'), qList.length, aList.join('//'), aList.length, iList, rList, {from: accounts[0]});
    tId = fSub.receipt.logs[0].args._tId;
 });

  it('Has an owner', async () => {
    assert.equal(await fCore.admin(), admin);
  });

  it('Flash card can be added to fav', async () => {
    await fCore.addFlashCardToFav(1, {from: admin});
    let ans = await fCore.isFlashCardInFav(1, {from: admin});
    assert.equal(ans, true);
  });

  it('Can not be added to fav twice', async () => {
    try{
      await fCore.addFlashCardToFav(1, {from: admin});
      await fCore.addFlashCardToFav(1, {from: admin});
    }
    catch(e){
      const revertErr = e.message.search('revert') >= 0;
      assert(revertErr, "Expected throw, got '" + e + "' instead");
      return;
    }
    assert.fail('Expected throw not received');
  });

  it('Flashcards are submitted with right values', async () => {
    let fInfo = await fCore.getFlashcardInfoById(tId);

    assert.equal(fInfo[0], 2); // category
    assert.equal(fInfo[2], 3); // language
    assert.equal(fInfo[8], 2); // Number of questions

    let qInfo = await fCore.getQuestionInfoById(tId, 1);
    assert.equal(qInfo[0], "Ясос Биба наш гейрой");
    assert.equal(qInfo[1], 3); // number of answers
    assert.equal(qInfo[2], 3); // correct answer
    qInfo = await fCore.getQuestionInfoById(tId, 2);
    assert.equal(qInfo[0], "Да да я да");
    assert.equal(qInfo[1], 2); // number of answers
    assert.equal(qInfo[2], 1); // correct answer

    let aInfo = await fCore.getAnswerBodyById(tId, 1, 3);
    assert.equal(aInfo, "yasos biba is our hero!");
    aInfo = await fCore.getAnswerBodyById(tId, 2, 2);
    assert.equal(aInfo, "I give up");
  });

  it('Should return language ids', async () => {
    let list = await fCore.getLanguageIds();
    assert.equal(list.length, 3);
  });

  it('Should return category ids', async () => {
    let list = await fCore.getCategoryIds();
    assert.equal(list.length, 3);
  });

  it('Rate the flashcard', async () => {
    await fCore.rateFlashCard(tId, 3, {from: accounts[0]})
    let rate = await fCore.getFlashcardRate(tId, {from: accounts[0]})
    assert.equal(rate, 3);
  });

});
