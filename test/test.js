var FlashCards = artifacts.require("FlashCards");

contract('FlashCards', function(accounts) {
  var admin = accounts[0];
  var ethAmount = 5200000000000000;
  var smallEthAmount = 1;
  let tCore;
  let accNoFunds = web3.eth.accounts.create('test123');

  beforeEach('Setup contract for each test', async () => {
    fCore = await FlashCards.new();
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

  it('User can create flashcard', async () => {
    let qList = [ "Ясос Биба наш гейрой", "Да да я да"];
    let aList = [ "I suck penis as a hero", "I am muslim and I am proud of it", "yasos biba is our hero!",
                  "Yes I am yes", "I give up"];
    let iList = [ 3, 2]; // number of answers for each question
    let rList = [3, 1]; // right answers, 1<->n

    await fCore.submitFlashCard(2, 3, qList, aList, iList, rList, {from: accounts[0]});
  });

});
