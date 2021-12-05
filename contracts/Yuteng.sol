// contracts/Yuteng.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//ERC20 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "hardhat/console.sol";

/**
 * 部合约通知接口
 * receiveApproval token授权通知（非标准接口）
 * receiveApproval token接收通知（非标准接口）
 */
interface ContractCallFallBack {
     function receiveApproval(address from, uint256 _amount, bytes memory _data) external;
     function receiveToken(address from , uint256 _amount, bytes memory _data) external;
}

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

    /**
     * 向合约发送以太币 包含数据时调用
     * 向合约发送以太币，附加数据时会触发该函数的调用
     * 调用不存在的函数也会触发该函数的回调
     * 仅仅是演示1:1兑换token
     */
    fallback() external payable {
        console.log('Yuteng fallback success call');
       _sendToken(msg.value, 101);
    }

    /**
     * 向合约发送以太币 不包含数据时调用
     * 向合约发送以太币，没有附加数据时会触发该函数的调用
     * 即使没有明确兑换的兑换函数或者UI调用
     * 只需通过向改地址转账也可以实现ETH和当前合约token的兑换
     * 仅仅是演示1:1兑换token
     */
    receive() external payable {
       _sendToken(msg.value, 102);
    }

    /**
     * 兑换token接口 非ERC标准接口
     * 代币合约通过该接口调用可以实现
     * 初始发行代币兑换
     * 具体的业务逻辑可根据业务场景编写
     * 这里仅做演示，1:1兑换token
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
     * 非ERC20标准协议接口
     * 针对外部合约授权进行通知
     */
    function approveAndCall(address _spender, uint256 _amount, bytes memory _extraData
    ) external returns (bool success)  {
        //调用本地合约授权接口
        require(!approve(_spender, _amount), "approveAndCall fail");
        
        //通知外部合约授权成功
        ContractCallFallBack(_spender).receiveApproval(
            msg.sender,
            _amount,
            _extraData
        );

        //返回调用结果
        return true;
    }

    /**
     * 非ERC20标准协议接口
     * 针对外部合约转账进行通知
     */
    function transferAndCall(address _recipient, uint256 _amount, bytes memory _extraData) external returns(bool) {
        //对目标合约进行转账
        require(!transfer(_recipient, _amount));
        
        //通知目标合约转账成功
        ContractCallFallBack(_recipient).receiveToken(msg.sender, _amount, _extraData);

        //返回调用结果
        return true;
    }

    /**
     * 向合约发送以太币 自动接收token
     * eth兑换token
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