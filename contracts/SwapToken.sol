// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
abstract contract ERC20Interface {
    function allowance(address owner, address spender) public view virtual returns (uint256);
    function approve(address owner, address spender, uint256 amount) public virtual returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool);
    function test() public view virtual returns(address); 
    function balanceOf(address account) public view virtual returns (uint256);
}


contract SwapToken {
    ERC20Interface erc20Interface;
    address contractAddressCurrent;
    constructor(address contractAddress) payable {
        erc20Interface = ERC20Interface(contractAddress);
        contractAddressCurrent = contractAddress;
    }

    function approve(uint256 amount) external returns(bool) {
        erc20Interface.approve(msg.sender, address(this), amount);
        return true;
    }
    
    function allowance() external view returns (uint256) {
        return erc20Interface.allowance(msg.sender, address(this));
    }

    function test() external view returns (address) {
        return erc20Interface.test();
    }

    function balanceOf(address addr) public view  returns (uint256) {
        return erc20Interface.balanceOf(addr);
    }

    function transferToContract(uint256 amount) public returns(bool){
	    erc20Interface.transferFrom(msg.sender, address(this), amount);
        return true;
    }

    function transferToContractTest(address owner, address user, uint256 amount) public returns(bool){
	    erc20Interface.transferFrom(owner, user, amount);
        return true;
    }

}