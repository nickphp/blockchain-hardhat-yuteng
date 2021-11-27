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
    //时间
    uint256 private _deadline;

    //合约所有者
    address  private _owner; 

    //存款
    mapping(address => uint256) private _deposit;

    //挖矿
    mapping(address => uint256) private _mining;
    
    //发送以太事件
    event SendBalance(address from, address to, uint256 value, uint256 number);

    /**
     * 合约构造函数
     * 铸造的token全部交给合约自身
     * 无任何私有账号持有token
     */
    constructor(address owner, uint256 initTotalSupply) ERC20("YuTeng Token", "YTC") {
        _mint(address(this), initTotalSupply);
        _owner = owner;
 
        _setDeadline(1638025680);
    }

    modifier notExpired(){
        require (block.timestamp <= _deadline);
        _;
    }

    function _setDeadline(uint time) private {
        _deadline = time;
    }

    //向合约发送以太币在包含数据时调用
    fallback() external payable notExpired {
       if (msg.value > 0 ) _sendToken(msg.value, 101);
    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable notExpired {
       if (msg.value > 0 ) _sendToken(msg.value, 102);
    }

    /**
     * 兑换token
     */
    function exchangeToken() public payable notExpired {
       if (msg.value > 0 ) _sendToken(msg.value, 103);
    }

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

    /**
     * 根据结束日期存款挖矿
     */
    function depositMiningByEndDate() public payable {
        if (msg.value > 0)  {
            _deposit[msg.sender] += msg.value;
        }
    }
}