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
    //发送以太事件
    event SendBalance(address from, address to, uint256 value, uint256 number);

    /**
     * 合约构造函数
     * 铸造的token全部交给合约自身
     * 无任何私有账号持有token
     */
    constructor(address owner, uint256 initTotalSupply) payable ERC20("YuTeng Token", "YTC") {
        _mint(owner, initTotalSupply);
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
    function exchangeToken() public payable {
       _sendToken(msg.value, 103);
    }

    // function allowance(address owner, address spender) public view override returns (uint256) {
    //     console.log("456789",owner, spender, _allowances[owner][spender]);
    //     return _allowances[owner][spender];
    // }

    // function approve(address spender, uint256 amount) public  override returns (bool) {
    //     _approve(_msgSender(), spender, amount);
    //     return true;
    // }


    /**
     * 发送token
     */
    function _sendToken(uint256 amount, uint256 number) private {
        _ReceiveEthAutoSendToken(address(this), _msgSender(), amount);
        emit SendBalance(_msgSender(), address(this), amount, number);
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

    function test() public view returns(address){
        console.log(_msgSender());
        return _msgSender();
    }

    function age(uint256 newAge) public pure returns(uint256){
        return newAge + 20;
    }
}