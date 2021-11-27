// contracts/Yuteng.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//ERC20 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

/**
 * Yuteng Token合约
 */
contract Yuteng is ERC20 {
    //发送以太事件
    event SendBalance(address from, address to, uint value, uint number);

     //合约所有者
    address  private _owner;
    
    /**
     * 合约构造函数
     */
    constructor(address owner, uint256 initTotalSupply) ERC20("YuTeng Token", "YTC") {
        _mint(owner, initTotalSupply);
        _owner = owner;
    }

    //向合约发送以太币在包含数据时调用
    fallback() external payable {
       if (msg.value > 0 ) _sendToken(msg.value, 101);
    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable {
       if (msg.value > 0 ) _sendToken(msg.value, 102);
    }

    /**
     * 发送token
     */
    function _sendToken(uint256 amount, uint256 number) private {
        _ReceiveEthAutoSendToken(_owner, _msgSender(), amount);
        emit SendBalance(_msgSender(), address(this), amount, number);
    }

    /**
     * 兑换token的api
     */
    function exchangeToken() public payable {
       if (msg.value > 0 ) _sendToken(msg.value, 103);
    }

    /**
     * 向合约发送以太币 自动接收token
     */
    function _ReceiveEthAutoSendToken(
        address sender,
        address recipient,
        uint256 amount
    ) private  returns (bool) {
        _transfer(sender, recipient, amount);
        return true;
    }
}