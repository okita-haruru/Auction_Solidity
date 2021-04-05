const MetaCoin = artifacts.require("TokenERC20");
const deal = artifacts.require("SimpleAuction")

contract("1nd MetaCoin test", async accounts => {
  it("should put 10000 MetaCoin in the first account", async () => {
    let instance = await MetaCoin.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance.valueOf(), 20000);
  });

   it("init deal", async () => {
     let instance = await deal.deployed();
     let fixedPrice= await instance.fixedPrice.call();
     let lowestPrice= await instance.lowestPrice.call();
     assert.equal(fixedPrice.toNumber(),10000);
     assert.equal(lowestPrice.toNumber(),200);
   });

   it("change lowest", async () => {
    let instance = await deal.deployed();
    await instance.changeLowestPrice(100);
    let lowestPrice= await instance.lowestPrice.call();
    assert.equal(lowestPrice.toNumber(),100);
  });

   it("bid", async () => {
    let coin = await MetaCoin.deployed();
    let instance = await deal.deployed();
    await coin.transfer(accounts[1],3000);
    await coin.approve(instance.address,3000,{from:accounts[1]});
    await instance.bid(3000,{from:accounts[1]});
    let highestBid= await instance.highestBid.call();
    let bidded=await instance.bidded.call();
    assert.equal(highestBid.toNumber(),3000);
    assert.equal(bidded,true);
  });

  it("price_end", async () => {
    let coin = await MetaCoin.deployed();
    let instance = await deal.deployed();
    await coin.transfer(accounts[2],10000);

    let balance = await coin.balanceOf.call(accounts[2]);
    console.log("before:"+balance.toNumber());

    await coin.approve(instance.address,10000,{from:accounts[2]});
    await instance.bid(10000,{from:accounts[2]});

    balance = await coin.balanceOf.call(accounts[2]);
    console.log("after:"+balance.toNumber());

    let temp=await coin.balanceOf.call(accounts[0]);
    console.log(temp.toNumber());
    await instance.auctionDeal_Price();
    let ended= await instance.ended.call();
    assert.equal(ended,true);
  });

  /*it("take out", async () => {
    let instance = await deal.deployed();
    await instance.bid({from: accounts[0],value:3000});
    let highestBid= await instance.highestBid.call();
    assert.equal(highestBid.toNumber(),3000);
  });*/

   

  
  
});