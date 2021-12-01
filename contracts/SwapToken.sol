// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
abstract contract ERC20Interface {
    function transfer(address recipient, uint256 amount) public virtual returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool);
}

/**
 * 简单token交换协议
 * 前提是必须对该合约进行授权
 */
contract SwapToken {
    ERC20Interface private erc20Interface; //合约接口实例
    mapping (address => bool) private _contracts; //交换合约地址列表
    address private _owner ; //合约拥有者
    mapping(address => mapping(address => uint256)) private _allowances; //合约授权token列表
    bool tokenToEthLock = false;
   

    /**
     * 初始化合约地址列表
     */
    constructor(address owner, address[] memory contracts) payable {
        //循环添加合约地址
        for (uint i = 0; i < contracts.length; i++) {
            _contracts[contracts[i]] = true;  //默认状态可用      
        }
        _owner = owner; //设置合约拥有者
    }

    //增加合约并设置状态
    function saveContract(address contractAddress, bool state) external returns(bool) {
        require(msg.sender == _owner, "No Auth"); //操作人检查
        _contracts[contractAddress] = state; 
        return true;
    }

    // //授权
    // function approve(uint256 amount) external returns(bool) {
    //     msg.sender.delegatecall(abi.encodeWithSignature("approve(address,amount)", address(this), amount));
    //     return true;
    // }

    //使用token向合约兑换eth(必须已授权)
    function tokenToEth(address contractAddress, uint56 amount) external returns(bool) {
        require(_contracts[contractAddress] == true, "Invalid contract address"); //合约检查
        require(address(this).balance >= amount, "Balance out of bounds"); //余额越界
        require(!tokenToEthLock, "Reentrant call detected!");//重入锁检查
        tokenToEthLock = true; //开启锁
        bool transferFormRst = _transferFrom(contractAddress, msg.sender, address(this), amount); //转移币
        require(transferFormRst, "Sending eth failed");//转移结果检查
        (bool success, ) = payable(msg.sender).call{ value: amount }(''); // 
        require(success, "Sending eth failed");//发送结果检查
        tokenToEthLock = false;//重置锁
        return true;
    }

    //使用Eth向合约兑换token
    function ethToToken(address contractAddress, uint256 amount) external payable returns(bool) {
        require(_contracts[contractAddress] == true, "Invalid contract address"); //合约检查
        bool transferFormRst = _transfer(contractAddress, msg.sender, amount); //转移币
        require(transferFormRst, "Sending eth failed");//发送结果检查
        return true;
    }

    /**
     * 使用一种token兑换另一种token
     * token兑换的前提是 两种token必须都已经授权
     * 两种资产必须在各自合约里面都有才能进行
     */
    function tokenToToken(address contractA, uint256 amountA, address contractB, uint256 amountB, address target) external returns(bool) {
        require(_contracts[contractA] == true, "Invalid contract address a"); //合约检查地址检查
        require(_contracts[contractB] == true, "Invalid contract address b"); //合约检查地址检查
        bool transferFormA = _transferFrom(contractA, msg.sender, target, amountA); //转移币 
        bool transferFormB = _transferFrom(contractB, target, msg.sender, amountB); //转移币
        require(transferFormA == true , "Sending eth failed a");//发送结果检查
        require(transferFormB == true , "Sending eth failed b");//发送结果检查
        return true;
    }

    /**
     * 合约向用户转币
     */
    function _transfer(address contractAddress, address recipient, uint256 amount) private returns(bool) {
        erc20Interface = ERC20Interface(contractAddress); //获取合约对象
	    bool result = erc20Interface.transfer(recipient, amount);//合约转token
        return result;
    }

    /**
     * 合约转移用户授权的币
     */
    function _transferFrom(address contractAddress, address holder, address recipient, uint256 amount) private returns(bool) {
        erc20Interface = ERC20Interface(contractAddress); //获取合约对象
	    bool result = erc20Interface.transferFrom(holder, recipient, amount);//合约转token
        return result;
    }
    
}