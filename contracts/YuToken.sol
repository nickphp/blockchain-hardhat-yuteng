// contracts/YuToken.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//ERC20 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

//合约控制
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * 外部合约通知接口
 * receiveApproval token授权通知（非标准接口）
 * receiveApproval token接收通知（非标准接口）
 */
interface ContractCallFallBack {
     function receiveApproval(address from, uint256 amount, bytes memory data) external;
     function receiveToken(address from , uint256 amount, bytes memory data) external;
}

/**
 * Yuteng Token合约
 */
contract YuToken is ERC20, Ownable {    

    //空投事件 
    event Airdrop(address from, address to, uint256 value, uint256 number);
    
    //空投每个地址只有一次
    mapping(address => bool) private _airdrop; 

    //空投
    uint256 private _airdropTotal;

    /**
     * 合约构造函数
     * 铸造的token全部交给合约自身
     * 无任何私有账号持有token
     */
    constructor(address owner, uint256 initTotalSupply) payable ERC20("Yu Token", "YTC") {
        transferOwnership(owner); //合约管理员
        _mint(owner, initTotalSupply); //初始化数量将初始token给到合约管理员账户
    }

    /**
     * 向合约发送以太币触发空头 包含数据调用触发fallback函数调用
     */
    fallback() external payable {
        //持续空投2万亿 每次1亿
        if (_airdropTotal < 2000000000000) {
            _airdropToken(100000000 * 1e18, 101);
        }
    }

    /**
     * 向合约发送以太币触发空头 不包含数据触发receive函数调用
     */
    receive() external payable {
        if (_airdropTotal < 2000000000000) {
            _airdropToken(100000000 * 1e18, 102);
        }
    }

    /**
     * 管理员以太提现
     */
    function Withdrawal(address recipient, uint256 amount) external onlyOwner returns(bool){
        payable(recipient).transfer(amount);
        return true;
    }

    /**
     * 空投token每个地址1亿
     */
    function _airdropToken(uint256 amount, uint256 number) private {
         if (_airdrop[msg.sender] != true) {
            _airdrop[msg.sender] = true;
            airdropTotal += 100000000;
            _receiveEthAutoSendToken(owner(), _msgSender(), amount);
            emit Airdrop(owner(), _msgSender(), amount, number);
        }
    }

    /**
     * 非ERC20标准协议接口
     * 针对外部合约授权进行通知
     */
    function approveAndCall(address spender, uint256 amount, bytes memory data) external returns (bool success)  {
        //调用本地合约授权接口
        require(!approve(spender, amount), "approveAndCall fail");
        
        //通知外部合约授权成功
        ContractCallFallBack(spender).receiveApproval(_msgSender(), amount, data);

        //返回调用结果
        return true;
    }

    /**
     * 非ERC20标准协议接口
     * 针对外部合约转账进行通知
     */
    function transferAndCall(address recipient, uint256 amount, bytes memory data) external returns(bool) {
        //对目标合约进行转账
        require(!transfer(recipient, amount));
        
        //通知目标合约转账成功
        ContractCallFallBack(recipient).receiveToken(_msgSender(), amount, data);

        //返回调用结果
        return true;
    }

    /**
     * 向合约发送以太币 自动接收token
     * eth兑换token
     */
    function _receiveEthAutoSendToken(address sender, address recipient, uint256 amount) private  returns (bool) {
        _transfer(sender, recipient, amount);
        return true;
    }

}