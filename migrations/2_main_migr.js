var FlashCards = artifacts.require("FlashCards");

module.exports = function(deployer) {
  deployer.deploy(FlashCards);
};
