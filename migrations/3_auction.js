//const Migrations = artifacts.require("Migrations");
const SimpleAuction = artifacts.require("SimpleAuction");
const TokenERC20 = artifacts.require("TokenERC20");
module.exports = function (deployer) {
    //deployer.deploy(Migrations);
    //deployer.deploy(TokenERC20);
    deployer.deploy(SimpleAuction,1000,10000,200,TokenERC20.address);
    

  };