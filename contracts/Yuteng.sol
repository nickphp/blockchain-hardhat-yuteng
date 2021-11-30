// contracts/Yuteng.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//ERC20 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "hardhat/console.sol";

/**
 * Yuteng Token合约
 */
contract Yuteng is ERC20 {    
    address _owner;

    //发送以太事件
    event SendBalance(address from, address to, uint256 value, uint256 number);

    /**
     * 合约构造函数
     * 铸造的token全部交给合约自身
     * 无任何私有账号持有token
     */
    constructor(address owner, uint256 initTotalSupply) payable ERC20("YuTeng Token", "YTC") {
        _mint(owner, initTotalSupply);
        _owner = owner;
    }

    //向合约发送以太币在包含数据时调用
    fallback() external payable {
       _sendToken(msg.value, 101);
    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable {
       _sendToken(msg.value, 102);
    }

    /**
     * 兑换token
     */
    function exchangeToken() external payable {
       _sendToken(msg.value, 103);
    }

    /**
     * 发送token
     */
    function _sendToken(uint256 amount, uint256 number) private {
        _receiveEthAutoSendToken(_owner, _msgSender(), amount);
        emit SendBalance(_msgSender(), _owner, amount, number);
    }

    /**
     * 向合约发送以太币 自动接收token
     */
    function _receiveEthAutoSendToken(
        address sender,
        address recipient,
        uint256 amount
    ) private  returns (bool) {
        _transfer(sender, recipient, amount);
        return true;
    }

}