const MetaCoin = artifacts.require("TokenERC20");
const deal = artifacts.require("SimpleAuction")

contract("1st MetaCoin and Deal test", async accounts => {
  it("should put 10000 MetaCoin in the first account", async () => {
    let instance = await MetaCoin.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance.valueOf(), 20000);
  });
 
  
});

contract("2nd Deal test", async accounts => {

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

  

  it("take out and check", async () => {
    let coin = await MetaCoin.deployed();
    let instance = await deal.new(1000,10000,200,coin.address);
    
    await coin.transfer(accounts[1],3000);
    let balance = await coin.balanceOf.call(accounts[1]);
    //console.log("payed(excepted3000):"+balance.toNumber());
    await coin.approve(instance.address,3000,{from:accounts[1]});
    await instance.bid(3000,{from:accounts[1]});
    await coin.transfer(accounts[2],10000);
    await coin.approve(instance.address,10000,{from:accounts[2]});
    await instance.bid(10000,{from:accounts[2]});

    //await instance.checkMyPrice({from:accounts[1]});
    //let his=await instance.temp.call();
    //console.log(his.toNumber());
    //assert.equal(his.toNumber(),3000);

    await instance.auctionDeal_Price();
    
    //let ended= await instance.ended.call();
    //console.log("ended:"+ended);
    await instance.withdraw({from:accounts[1]});
    
    balance= await coin.balanceOf.call(accounts[1]);
    assert.equal(balance.toNumber(),3000);
  });

   

  
  
});

contract("3rd price end", async accounts => {
  it("price_end", async () => {
    let coin = await MetaCoin.deployed();
    let instance = await deal.deployed();
    await coin.transfer(accounts[2],10000);
 
    let balance = await coin.balanceOf.call(accounts[2]);
    //console.log("before:"+balance.toNumber());
 
    await coin.approve(instance.address,10000,{from:accounts[2]});
    await instance.bid(10000,{from:accounts[2]});
 
    balance = await coin.balanceOf.call(accounts[2]);
    //console.log("after:"+balance.toNumber());
 
   // let temp=await coin.balanceOf.call(accounts[0]);
    //console.log(temp.toNumber());
    await instance.auctionDeal_Price();
    let ended= await instance.ended.call();
    assert.equal(ended,true);
  });
 
  
  
});

contract("4th time end", async => {
  it("time_end", async () => {;
    let instance = await deal.deployed();
    setTimeout( function(){
    instance.auctionDeal_Time();
    let ended= instance.ended.call();
    assert.equal(ended,true);
    }, 20 * 1000 )
     
  });
  
});