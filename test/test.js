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

});
