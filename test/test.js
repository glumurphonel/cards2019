var FlashCards = artifacts.require("FlashCards");

contract('FlashCards', function(accounts) {
  var admin = accounts[0];
  var ethAmount = 5200000000000000;
  var smallEthAmount = 1;
  let tCore;
  let accNoFunds = web3.eth.accounts.create('test123');

  beforeEach('Setup contract for each test', async () => {
    tCore = await FlashCards.new();
  });

  it('Has an owner', async () => {
    assert.equal(await tCore.admin(), admin);
  });




});
