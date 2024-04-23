const Crowdsource = artifacts.require("Crowdsource");

module.exports = function(deployer) {
  deployer.deploy(Crowdsource);
};
