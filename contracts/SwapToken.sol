// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
abstract contract ERC20Interface {
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool);
}

contract SwapToken {
    ERC20Interface erc20Interface;
    address private _owner;
    constructor() payable {
        _owner = msg.sender;
    }

    function transferFrom(address contractAddress, address sender, address spender, uint256 amount) public returns(bool) {
        // require(_owner == msg.sender, "transferFrom fail no auth");
        erc20Interface = ERC20Interface(contractAddress);
	    bool result = erc20Interface.transferFrom(sender, spender, amount);
        require(result == true, "transferFrom fail");
        return true;
    }
    
}