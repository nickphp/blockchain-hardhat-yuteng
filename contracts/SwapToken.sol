// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
abstract contract ERC20Interface {
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool);
    function test() public view virtual returns(address); 
    function balanceOf(address account) public view virtual returns (uint256);
    function exchangeToken() public virtual payable;
}

contract SwapToken {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    ERC20Interface erc20Interface;
    address contractAddressCurrent;
    constructor(address contractAddress) payable {
        erc20Interface = ERC20Interface(contractAddress);
        contractAddressCurrent = contractAddress;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        (bool rslt, bytes memory data) = contractAddressCurrent.delegatecall(abi.encodeWithSignature("approve(address,uint256)", spender, amount));
        require(rslt, 'Delegate Call failed');
        return abi.decode(data, (bool));
    }

    function allowance(address owner, address spender) external returns (uint256) {
        console.log(owner,spender);
     
        (bool rslt, bytes memory data) = contractAddressCurrent.delegatecall(abi.encodeWithSignature("allowance(address,address)", owner, owner));
        console.log(rslt);
        require(rslt, 'Delegate Call failed2');
        return abi.decode(data, (uint256));
    
    }

    function test() external view returns (address) {
        return erc20Interface.test();
    }

    // function age2(uint256 newAge) external returns (bool) {
    //     (bool rslt, bytes memory data) = contractAddressCurrent.delegatecall(abi.encodeWithSignature("age(uint256)", newAge));
    //     require(rslt, 'Delegate Call failed2');
    //     return abi.decode(data, (bool));
    // }
    

    function balanceOf(address addr) public view  returns (uint256) {
        return erc20Interface.balanceOf(addr);
    }

    function transferToContract(address sender, address spender, uint256 amount) public returns(bool) {
        console.log(sender, spender, amount);
	    erc20Interface.transferFrom(sender, spender, amount);
        return true;
    }

    function transferToContractTest(address owner, address user, uint256 amount) public returns(bool) {
	    erc20Interface.transferFrom(owner, user, amount);
        return true;
    }


    function exchangeToken() public payable {
        //payable(address(erc20Interface)).transfer(1 ether);
        
        //当前合约向指定账户发送以太币
        //payable(address(erc20Interface)).transfer(msg.value);
    }

}