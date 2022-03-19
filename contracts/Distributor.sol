
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Distributor {

    address[] public tokenList;
    address payable public owner;

    event ERCTokenDistributed(address indexed tokenAddress, uint indexed amount);
    event EtherDistributed(uint indexed amountPerPerson);
    event FeesCollected(address owner);

    constructor () {
        owner = payable(msg.sender);
    }

    function distribute(address[] memory users, bool isErcTransfer, address ercTokenAddress, uint ercAmt) external payable {
      
        require(users.length > 0, "Users not defined");
        if(!isErcTransfer) {
            require(msg.value > 0, "Ether value must be positive");
            uint amount = msg.value;
            uint fees = amount/1000;
            uint amtDistribute = amount - fees;
            uint amt = amtDistribute/users.length;


            for (uint i = 0; i < users.length; i++) {
                payable(address(users[i])).transfer(amt);
            }
            emit EtherDistributed(amt);

        } else {
            require(msg.value == 0, "Ether value must be 0");
            require(IERC20(ercTokenAddress).allowance(msg.sender, address(this)) >= ercAmt);
            IERC20(ercTokenAddress).transferFrom(msg.sender, address(this), ercAmt);
            tokenList.push(ercTokenAddress);
            transferERC20(users, ercTokenAddress, ercAmt);
        }
    }

    function transferERC20(address[] memory users, address tokenAddress, uint amount) internal {
        uint fees = amount/1000;
        uint amtDistribute = amount - fees;
        uint amt = amtDistribute/users.length;
        for(uint i = 0; i < users.length; i++) {
            IERC20(tokenAddress).transfer(users[i], amt);
        }
        emit ERCTokenDistributed(tokenAddress, amt);
    }

    function collectFees() external  {
        require(msg.sender == owner, "Caller is not the owner");
        payable(address(owner)).transfer(address(this).balance);

        for(uint i = 0; i < tokenList.length; i++) {

            IERC20 token = IERC20(tokenList[i]);
            token.transfer(owner, token.balanceOf(address(this)));

        }
        emit FeesCollected(owner);
    }
}