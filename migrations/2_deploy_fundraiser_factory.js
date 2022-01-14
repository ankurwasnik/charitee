var Migrations = artifacts.require("./FundraiserFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};