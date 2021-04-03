// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;

import "./erc20.sol";

contract SimpleAuction {
    // 拍卖的参数。
    address payable public beneficiary;
    uint public auctionEnd;
    address public highestBidder;
    uint public highestBid;
    uint public fixedPrice;
    uint public lowestPrice;
    TokenERC20 public erc;

    //取出列表
    mapping(address => uint) pendingReturns;
    //mapping(address => uint) historyPrices;
    bool public ended;
    bool public bidded;
    

    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor(
        uint _biddingTime,
        uint _fixedPrice,
        uint _lowestPrice,
        TokenERC20 token
    ) public {
        fixedPrice=_fixedPrice;
        erc=token;
        bidded=false;
        lowestPrice=_lowestPrice;
        highestBid=_lowestPrice;
        beneficiary = payable(msg.sender);
        auctionEnd = block.timestamp + _biddingTime;
    }
    function bid(uint value) public {
        require(
            block.timestamp <= auctionEnd,
            "Auction already ended."
        );//已结束
        require(
            value+pendingReturns[msg.sender] > highestBid,
            "There already is a higher bid."
        );//出价太低
        erc.transferFrom(msg.sender, beneficiary, value);
        bidded=true;
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        
        highestBidder = msg.sender;
        highestBid = value + pendingReturns[msg.sender];
        pendingReturns[msg.sender]=0;
        emit HighestBidIncreased(msg.sender, value + pendingReturns[msg.sender]);
    }

    /// 取回出价（当该出价已被超越）
    function withdraw() public returns (bool) {
        require(ended,"Auction not yet ended.");
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            //取出
            pendingReturns[msg.sender] = 0;
           //payable(msg.sender).transfer(amount);
           //erc._transfer(beneficiary,msg.sender,amount);
           erc.transfer(msg.sender, amount);
        }
        return true;
    }

    function auctionDeal_Time() public {
        
        require(block.timestamp >= auctionEnd, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        //beneficiary.transfer(highestBid);
        erc.transfer(beneficiary, highestBid);
    }
    
    function auctionDeal_Price() public {
        
        require(!ended, "auctionEnd has already been called.");
        require(highestBid>=fixedPrice,"Deal");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        //beneficiary.transfer(highestBid);
        erc.transfer(beneficiary, highestBid);
    }
    
    function checkMyPrice() public returns (uint){
        require(!ended, "auctionEnd has already been called.");
        return pendingReturns[msg.sender];
    }
    
    function changeLowestPrice(uint value) public payable{
        require(!ended, "auctionEnd has already been called.");
        require(!bidded, "There is somebody bidded");
        require(msg.sender==beneficiary,"only the owner can change the lowest price");
        
        highestBid=value;
        lowestPrice=value;
    }
function bytesToAddress(bytes memory bys) private pure returns (address addr) {
    assembly {
        addr := mload(add(bys, 32))
    } 
}
}